// server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const path = require('path'); // 👈 AGREGAR

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
connectDB();

// 👇 AGREGAR - Servir archivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rutas
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/biciestacionamientos', require('./routes/biciestacionamientoRoutes'));
app.use('/api/propuestas', require('./routes/propuestas')); // 👈 AGREGAR

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({ message: 'API funcionando correctamente' });
});

// Manejo de errores 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
