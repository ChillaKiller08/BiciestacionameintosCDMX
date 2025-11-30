// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Proteger rutas - verificar token
exports.protect = async (req, res, next) => {
  let token;

  // Obtener token del header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Verificar si existe el token
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No autorizado - No se proporcionó token'
    });
  }

  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Obtener usuario del token
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'No autorizado - Usuario no encontrado'
      });
    }

    next();
  } catch (error) {
    console.error('Error en protect middleware:', error);
    return res.status(401).json({
      success: false,
      message: 'No autorizado - Token inválido'
    });
  }
};

// Autorizar solo a usuarios con rol específico
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `El rol ${req.user.role} no tiene permiso para acceder a esta ruta`
      });
    }
    next();
  };
};