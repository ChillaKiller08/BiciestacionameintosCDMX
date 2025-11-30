// models/Biciestacionamiento.js
const mongoose = require('mongoose');

const BiciestacionamientoSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es obligatorio'],
    trim: true
  },
  ubicacion: {
    direccion: {
      type: String,
      required: [true, 'La dirección es obligatoria'],
      trim: true
    },
    delegacion: {
      type: String,
      required: [true, 'La delegación es obligatoria'],
      trim: true
    },
    colonia: {
      type: String,
      required: [true, 'La colonia es obligatoria'],
      trim: true
    },
    codigoPostal: {
      type: String,
      trim: true
    },
    coordenadas: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],
        required: true,
        validate: {
          validator: function(v) {
            return v.length === 2;
          },
          message: 'Las coordenadas deben tener exactamente 2 valores [lng, lat]'
        }
      }
    }
  },
  horario: {
    type: String,
    required: [true, 'El horario es obligatorio'],
    trim: true
  },
  dias: {
    type: [String],
    required: [true, 'Los días son obligatorios'],
    enum: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
  },
  capacidad: {
    type: Number,
    required: [true, 'La capacidad es obligatoria'],
    min: [1, 'La capacidad debe ser al menos 1']
  },
  tipo: {
    type: String,
    required: [true, 'El tipo es obligatorio'],
    enum: ['Público', 'Privado', 'Restringido'],
    default: 'Público'
  },
  requisitos: {
    type: String,
    trim: true,
    default: 'Ninguno'
  },
  foto: {
    type: String,
    default: 'https://via.placeholder.com/400x300?text=Biciestacionamiento'
  },
  descripcion: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'maintenance'],
    default: 'active'
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Índice geoespacial
BiciestacionamientoSchema.index({ 'ubicacion.coordenadas': '2dsphere' });

module.exports = mongoose.models.Biciestacionamiento || mongoose.model('Biciestacionamiento', BiciestacionamientoSchema);