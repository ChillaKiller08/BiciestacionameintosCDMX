// routes/biciestacionamientoRoutes.js
const express = require('express');
const router = express.Router();
const {
  createBiciestacionamiento,
  getAllBiciestacionamientos,
  getBiciestacionamientoById,
  updateBiciestacionamiento,
  deleteBiciestacionamiento,
  getNearbyBiciestacionamientos
} = require('../controllers/biciestacionamientoController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Rutas públicas
router.get('/', getAllBiciestacionamientos);
router.get('/nearby/:lat/:lng', getNearbyBiciestacionamientos);
router.get('/:id', getBiciestacionamientoById);

// Rutas protegidas (solo admin)
router.post('/', protect, authorize('admin'), createBiciestacionamiento);
router.put('/:id', protect, authorize('admin'), updateBiciestacionamiento);
router.delete('/:id', protect, authorize('admin'), deleteBiciestacionamiento);

module.exports = router;