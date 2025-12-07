// routes/propuestas.js
const express = require('express');
const router = express.Router();
const Propuesta = require('../models/Propuesta');
const Biciestacionamiento = require('../models/Biciestacionamiento');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');

// @route   POST /api/propuestas
// @desc    Crear nueva propuesta de biciestacionamiento
// @access  Private (usuarios autenticados)
router.post('/', protect, async (req, res) => {
  try {
    const {
      nombre,
      direccion,
      colonia,
      delegacion,
      lat,
      lng,
      horario,
      dias,
      capacidad,
      tipo,
      requisitos,
      descripcion,
      foto // 👈 Ahora es URL de Cloudinary (string)
    } = req.body;

    // Validar que se subió una foto
    if (!foto) {
      return res.status(400).json({
        success: false,
        message: 'La foto es obligatoria'
      });
    }

    // Crear propuesta
    const propuesta = await Propuesta.create({
      nombre,
      ubicacion: {
        direccion,
        colonia,
        delegacion,
        coordenadas: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]
        }
      },
      horario,
      dias: Array.isArray(dias) ? dias : JSON.parse(dias), // 👈 Manejar ambos casos
      capacidad: parseInt(capacidad),
      tipo,
      requisitos: requisitos || 'Ninguno',
      descripcion: descripcion || '',
      foto, // 👈 URL de Cloudinary
      propuestaPor: req.user._id,
      status: 'pendiente'
    });

    res.status(201).json({
      success: true,
      message: 'Propuesta enviada exitosamente. Será revisada por un administrador.',
      propuesta
    });

  } catch (error) {
    console.error('Error al crear propuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la propuesta',
      error: error.message
    });
  }
});

// @route   GET /api/propuestas
// @desc    Obtener todas las propuestas (admin) o propias (usuario)
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    // Si no es admin, solo ver sus propias propuestas
    if (req.user.role !== 'admin') {
      query.propuestaPor = req.user._id;
    }

    // Filtrar por status si se especifica
    if (req.query.status) {
      query.status = req.query.status;
    }

    const propuestas = await Propuesta.find(query)
      .populate('propuestaPor', 'name email')
      .populate('revisadoPor', 'name')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: propuestas.length,
      propuestas
    });

  } catch (error) {
    console.error('Error al obtener propuestas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener propuestas',
      error: error.message
    });
  }
});

// @route   PUT /api/propuestas/:id/aprobar
// @desc    Aprobar propuesta y crear biciestacionamiento
// @access  Admin
router.put('/:id/aprobar', protect, authorize('admin'), async (req, res) => {
  try {
    const propuesta = await Propuesta.findById(req.params.id);

    if (!propuesta) {
      return res.status(404).json({
        success: false,
        message: 'Propuesta no encontrada'
      });
    }

    if (propuesta.status !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'Esta propuesta ya fue revisada'
      });
    }

    // Crear biciestacionamiento a partir de la propuesta
    const biciestacionamiento = await Biciestacionamiento.create({
      nombre: propuesta.nombre,
      ubicacion: propuesta.ubicacion,
      horario: propuesta.horario,
      dias: propuesta.dias,
      capacidad: propuesta.capacidad,
      tipo: propuesta.tipo,
      requisitos: propuesta.requisitos,
      descripcion: propuesta.descripcion,
      foto: propuesta.foto, // 👈 URL de Cloudinary
      status: 'active',
      createdBy: req.user._id
    });

    // Eliminar la propuesta después de aprobarla
    await propuesta.deleteOne();

    res.json({
      success: true,
      message: 'Propuesta aprobada y biciestacionamiento creado',
      biciestacionamiento
    });

  } catch (error) {
    console.error('Error al aprobar propuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al aprobar propuesta',
      error: error.message
    });
  }
});

// @route   PUT /api/propuestas/:id/rechazar
// @desc    Rechazar propuesta
// @access  Admin
router.put('/:id/rechazar', protect, authorize('admin'), async (req, res) => {
  try {
    const { motivo } = req.body;

    if (!motivo) {
      return res.status(400).json({
        success: false,
        message: 'El motivo de rechazo es obligatorio'
      });
    }

    const propuesta = await Propuesta.findById(req.params.id);

    if (!propuesta) {
      return res.status(404).json({
        success: false,
        message: 'Propuesta no encontrada'
      });
    }

    if (propuesta.status !== 'pendiente') {
      return res.status(400).json({
        success: false,
        message: 'Esta propuesta ya fue revisada'
      });
    }

    // Eliminar la propuesta rechazada
    await propuesta.deleteOne();

    res.json({
      success: true,
      message: 'Propuesta rechazada y eliminada'
    });

  } catch (error) {
    console.error('Error al rechazar propuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al rechazar propuesta',
      error: error.message
    });
  }
});

// @route   DELETE /api/propuestas/:id
// @desc    Eliminar propuesta (solo el usuario que la creó o admin)
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const propuesta = await Propuesta.findById(req.params.id);

    if (!propuesta) {
      return res.status(404).json({
        success: false,
        message: 'Propuesta no encontrada'
      });
    }

    // Verificar permisos
    if (propuesta.propuestaPor.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta propuesta'
      });
    }

    await propuesta.deleteOne();

    res.json({
      success: true,
      message: 'Propuesta eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar propuesta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar propuesta',
      error: error.message
    });
  }
});

module.exports = router;