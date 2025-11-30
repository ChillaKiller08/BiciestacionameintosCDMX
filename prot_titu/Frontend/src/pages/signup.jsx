//signup.jsx
import React, { useState } from 'react';
import { signup } from '../services/authservice';
import './signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar mensajes de error al escribir
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validar que las contraseñas coincidan
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    // Validar longitud de contraseña
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      // Llamar al backend
      const response = await signup({
        nombre: formData.name,
        email: formData.email,
        password: formData.password
      });

      console.log('Usuario registrado:', response);
      setSuccess('¡Cuenta creada exitosamente! Redirigiendo...');
      
      // Limpiar formulario
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });

      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        window.location.href = '/';
      }, 2000);

    } catch (error) {
      console.error('Error al registrar:', error);
      setError(error.message || 'Error al crear la cuenta. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-login-container">
      <div className="signup-user-icon">
        <img src="/logo.png" alt="Logo" />
      </div>
      
      <p>¡Únete a nosotros!</p>
      
      {error && (
        <div style={{
          backgroundColor: '#fee',
          color: '#c33',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {success && (
        <div style={{
          backgroundColor: '#efe',
          color: '#3c3',
          padding: '10px',
          borderRadius: '5px',
          marginBottom: '15px',
          textAlign: 'center'
        }}>
          {success}
        </div>
      )}
      
      <form className="signup-login-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Nombre Completo</label>
        <input
          type="text"
          id="name"
          name="name"
          placeholder="Nombre Completo"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label htmlFor="email">Correo Electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="Correo Electrónico"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Contraseña (mínimo 6 caracteres)"
          value={formData.password}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <label htmlFor="confirmPassword">Confirmar Contraseña</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          placeholder="Confirmar Contraseña"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
          disabled={loading}
        />

        <button type="submit" className="signup-btn" disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
        </button>

        <div className="signup-create-account">
          <a href="/">¿Ya tienes cuenta? INICIAR SESIÓN</a>
        </div>
      </form>
    </div>
  );
};

export default Signup;