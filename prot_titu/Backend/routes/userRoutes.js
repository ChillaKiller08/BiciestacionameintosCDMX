// routes/userRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  toggleUserStatus
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// ====================================
// RUTAS PÚBLICAS PARA USUARIOS
// ====================================

// @route   PUT /api/users/profile
// @desc    Actualizar perfil de usuario autenticado
// @access  Private (cualquier usuario autenticado)
router.put('/profile', protect, async (req, res) => {
  try {
    const { nombre, currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Actualizar nombre
    if (nombre && nombre.trim()) {
      user.nombre = nombre.trim();
    }

    // Cambiar contraseña si se proporciona
    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          success: false,
          message: 'Debes proporcionar tu contraseña actual'
        });
      }

      // Verificar contraseña actual
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(400).json({
          success: false,
          message: 'La contraseña actual es incorrecta'
        });
      }

      // Validar nueva contraseña
      if (newPassword.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'La nueva contraseña debe tener al menos 6 caracteres'
        });
      }

      // Encriptar nueva contraseña
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res.json({
      success: true,
      message: 'Perfil actualizado exitosamente',
      user: {
        _id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Error al actualizar perfil:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar perfil',
      error: error.message
    });
  }
});

// ====================================
// RUTAS SOLO PARA ADMINISTRADORES
// ====================================

// Aplicar middlewares de protección y autorización para las rutas de admin
router.use(protect);
router.use(authorize('admin'));

router.get('/', getAllUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);
router.patch('/:id/toggle-status', toggleUserStatus);

module.exports = router;