// models/Propuesta.js
const mongoose = require('mongoose');

const propuestaSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
    trim: true
  },
  ubicacion: {
    direccion: {
      type: String,
      required: true
    },
    colonia: {
      type: String,
      required: true
    },
    delegacion: {
      type: String,
      required: true
    },
    coordenadas: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true
      }
    }
  },
  horario: {
    type: String,
    required: true
  },
  dias: {
    type: [String],
    required: true
  },
  capacidad: {
    type: Number,
    required: true
  },
  tipo: {
    type: String,
    enum: ['Público', 'Privado', 'Restringido'],
    required: true
  },
  requisitos: {
    type: String,
    default: 'Ninguno'
  },
  descripcion: {
    type: String,
    default: ''
  },
  foto: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pendiente', 'aprobado', 'rechazado'],
    default: 'pendiente'
  },
  propuestaPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ciclistas', // 👈 CAMBIADO de 'User' a 'ciclistas'
    required: true
  },
  motivoRechazo: {
    type: String,
    default: ''
  },
  fechaPropuesta: {
    type: Date,
    default: Date.now
  },
  fechaRevision: {
    type: Date
  },
  revisadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ciclistas' // 👈 CAMBIADO de 'User' a 'ciclistas'
  }
}, {
  timestamps: true
});

// Índice geoespacial
propuestaSchema.index({ 'ubicacion.coordenadas': '2dsphere' });

module.exports = mongoose.model('Propuesta', propuestaSchema);