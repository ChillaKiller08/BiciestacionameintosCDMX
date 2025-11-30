// controllers/biciestacionamientoController.js
const Biciestacionamiento = require('../models/Biciestacionamiento');
const User = require('../models/User'); // ← AGREGAR ESTA LÍNEA

// @desc    Crear un nuevo biciestacionamiento
// @route   POST /api/biciestacionamientos
// @access  Private/Admin
exports.createBiciestacionamiento = async (req, res) => {
  try {
    const {
      nombre,
      ubicacion,
      horario,
      dias,
      capacidad,
      tipo,
      requisitos,
      foto,
      descripcion
    } = req.body;

    // Validar campos obligatorios
    if (!nombre || !ubicacion || !horario || !dias || !capacidad || !tipo) {
      return res.status(400).json({
        success: false,
        message: 'Todos los campos obligatorios deben ser completados'
      });
    }

    // Validar coordenadas
    if (!ubicacion.coordenadas || !ubicacion.coordenadas.lat || !ubicacion.coordenadas.lng) {
      return res.status(400).json({
        success: false,
        message: 'Las coordenadas (lat y lng) son obligatorias'
      });
    }

    // Crear nuevo biciestacionamiento con formato GeoJSON
    const newBiciestacionamiento = new Biciestacionamiento({
      nombre,
      ubicacion: {
        direccion: ubicacion.direccion,
        delegacion: ubicacion.delegacion,
        colonia: ubicacion.colonia,
        codigoPostal: ubicacion.codigoPostal,
        coordenadas: {
          type: 'Point',
          coordinates: [
            parseFloat(ubicacion.coordenadas.lng), // Longitud primero
            parseFloat(ubicacion.coordenadas.lat)  // Latitud segundo
          ]
        }
      },
      horario,
      dias,
      capacidad,
      tipo,
      requisitos,
      foto,
      descripcion,
      createdBy: req.user.id
    });

    await newBiciestacionamiento.save();

    res.status(201).json({
      success: true,
      message: 'Biciestacionamiento creado exitosamente',
      biciestacionamiento: newBiciestacionamiento
    });

  } catch (error) {
    console.error('Error en createBiciestacionamiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear biciestacionamiento',
      error: error.message
    });
  }
};

// @desc    Obtener todos los biciestacionamientos
// @route   GET /api/biciestacionamientos
// @access  Public
exports.getAllBiciestacionamientos = async (req, res) => {
  try {
    const { status, tipo, delegacion } = req.query;
    
    // Construir filtros
    let filter = {};
    if (status) filter.status = status;
    if (tipo) filter.tipo = tipo;
    if (delegacion) filter['ubicacion.delegacion'] = delegacion;

    const biciestacionamientos = await Biciestacionamiento.find(filter)
      //.populate('createdBy', 'nombre email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: biciestacionamientos.length,
      biciestacionamientos
    });
  } catch (error) {
    console.error('Error en getAllBiciestacionamientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener biciestacionamientos',
      error: error.message
    });
  }
};

// @desc    Obtener un biciestacionamiento por ID
// @route   GET /api/biciestacionamientos/:id
// @access  Public
exports.getBiciestacionamientoById = async (req, res) => {
  try {
    const biciestacionamiento = await Biciestacionamiento.findById(req.params.id)
      .populate('createdBy', 'nombre email');

    if (!biciestacionamiento) {
      return res.status(404).json({
        success: false,
        message: 'Biciestacionamiento no encontrado'
      });
    }

    res.json({
      success: true,
      biciestacionamiento
    });
  } catch (error) {
    console.error('Error en getBiciestacionamientoById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener biciestacionamiento',
      error: error.message
    });
  }
};

// @desc    Actualizar biciestacionamiento
// @route   PUT /api/biciestacionamientos/:id
// @access  Private/Admin
exports.updateBiciestacionamiento = async (req, res) => {
  try {
    const {
      nombre,
      ubicacion,
      horario,
      dias,
      capacidad,
      tipo,
      requisitos,
      foto,
      descripcion,
      status
    } = req.body;

    const biciestacionamiento = await Biciestacionamiento.findById(req.params.id);

    if (!biciestacionamiento) {
      return res.status(404).json({
        success: false,
        message: 'Biciestacionamiento no encontrado'
      });
    }

    // Actualizar campos
    if (nombre) biciestacionamiento.nombre = nombre;
    if (horario) biciestacionamiento.horario = horario;
    if (dias) biciestacionamiento.dias = dias;
    if (capacidad) biciestacionamiento.capacidad = capacidad;
    if (tipo) biciestacionamiento.tipo = tipo;
    if (requisitos) biciestacionamiento.requisitos = requisitos;
    if (foto) biciestacionamiento.foto = foto;
    if (descripcion) biciestacionamiento.descripcion = descripcion;
    if (status) biciestacionamiento.status = status;

    // Actualizar ubicación si se proporciona
    if (ubicacion) {
      if (ubicacion.direccion) biciestacionamiento.ubicacion.direccion = ubicacion.direccion;
      if (ubicacion.delegacion) biciestacionamiento.ubicacion.delegacion = ubicacion.delegacion;
      if (ubicacion.colonia) biciestacionamiento.ubicacion.colonia = ubicacion.colonia;
      if (ubicacion.codigoPostal) biciestacionamiento.ubicacion.codigoPostal = ubicacion.codigoPostal;
      
      // Actualizar coordenadas si se proporcionan
      if (ubicacion.coordenadas && ubicacion.coordenadas.lat && ubicacion.coordenadas.lng) {
        biciestacionamiento.ubicacion.coordenadas = {
          type: 'Point',
          coordinates: [
            parseFloat(ubicacion.coordenadas.lng),
            parseFloat(ubicacion.coordenadas.lat)
          ]
        };
      }
    }

    await biciestacionamiento.save();

    res.json({
      success: true,
      message: 'Biciestacionamiento actualizado exitosamente',
      biciestacionamiento
    });
  } catch (error) {
    console.error('Error en updateBiciestacionamiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar biciestacionamiento',
      error: error.message
    });
  }
};

// @desc    Eliminar biciestacionamiento
// @route   DELETE /api/biciestacionamientos/:id
// @access  Private/Admin
exports.deleteBiciestacionamiento = async (req, res) => {
  try {
    const biciestacionamiento = await Biciestacionamiento.findById(req.params.id);

    if (!biciestacionamiento) {
      return res.status(404).json({
        success: false,
        message: 'Biciestacionamiento no encontrado'
      });
    }

    await biciestacionamiento.deleteOne();

    res.json({
      success: true,
      message: 'Biciestacionamiento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteBiciestacionamiento:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar biciestacionamiento',
      error: error.message
    });
  }
};

// @desc    Buscar biciestacionamientos cercanos
// @route   GET /api/biciestacionamientos/nearby/:lat/:lng
// @access  Public
exports.getNearbyBiciestacionamientos = async (req, res) => {
  try {
    const { lat, lng } = req.params;
    const maxDistance = req.query.maxDistance || 5000; // 5km por defecto

    const biciestacionamientos = await Biciestacionamiento.find({
      'ubicacion.coordenadas': {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseInt(maxDistance)
        }
      },
      status: 'active'
    });

    res.json({
      success: true,
      count: biciestacionamientos.length,
      biciestacionamientos
    });
  } catch (error) {
    console.error('Error en getNearbyBiciestacionamientos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al buscar biciestacionamientos cercanos',
      error: error.message
    });
  }
};