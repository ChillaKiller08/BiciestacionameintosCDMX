// ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  // Si no hay token, redirigir al login
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si requiere admin, verificar el rol
  if (requireAdmin) {
    try {
      const user = JSON.parse(userString);
      if (user.role !== 'admin') {
        // Si no es admin, redirigir a home
        return <Navigate to="/home" replace />;
      }
    } catch (error) {
      // Si hay error al parsear, redirigir al login
      return <Navigate to="/" replace />;
    }
  }

  // Si todo está bien, mostrar el componente
  return children;
};

export default ProtectedRoute;