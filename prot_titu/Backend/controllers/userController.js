// controllers/userController.js
const User = require('../models/User');

// @desc    Obtener todos los usuarios (solo admin) - SIN incluir otros admins
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    // Obtener todos los usuarios EXCEPTO los que tienen role 'admin'
    const users = await User.find({ role: { $ne: 'admin' } }).select('-password');
    
    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

// @desc    Obtener un usuario por ID
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // No permitir ver detalles de otros admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para ver este usuario'
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuario',
      error: error.message
    });
  }
};

// @desc    Actualizar usuario
// @route   PUT /api/users/:id
// @access  Private/Admin
exports.updateUser = async (req, res) => {
  try {
    const { nombre, email, role, status } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Proteger: No permitir modificar otros admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para modificar este usuario'
      });
    }

    // Proteger: No permitir convertir usuarios a admin desde aquí
    if (role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No puedes promover usuarios a administrador desde esta ruta'
      });
    }

    // Actualizar campos
    user.nombre = nombre || user.nombre;
    user.email = email || user.email;
    user.role = role || user.role;
    user.status = status || user.status;

    await user.save();

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      user: {
        id: user._id,
        nombre: user.nombre,
        email: user.email,
        role: user.role,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message
    });
  }
};

// @desc    Eliminar usuario
// @route   DELETE /api/users/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Proteger: No permitir eliminar otros admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No puedes eliminar a otros administradores'
      });
    }

    await user.deleteOne();

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message
    });
  }
};

// @desc    Activar/Desactivar usuario
// @route   PATCH /api/users/:id/toggle-status
// @access  Private/Admin
exports.toggleUserStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Proteger: No permitir desactivar otros admins
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'No puedes cambiar el estado de otros administradores'
      });
    }

    user.status = user.status === 'active' ? 'inactive' : 'active';
    await user.save();

    res.json({
      success: true,
      message: `Usuario ${user.status === 'active' ? 'activado' : 'desactivado'} exitosamente`,
      user: {
        id: user._id,
        nombre: user.nombre,
        status: user.status
      }
    });
  } catch (error) {
    console.error('Error en toggleUserStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Error al cambiar estado del usuario',
      error: error.message
    });
  }
};