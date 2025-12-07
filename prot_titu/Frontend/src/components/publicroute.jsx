// PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

const PublicRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const userString = localStorage.getItem('user');

  // Si ya está autenticado, redirigir según el rol
  if (token && userString) {
    try {
      const user = JSON.parse(userString);
      
      // Si es admin, va al dashboard de admin
      if (user.role === 'admin') {
        return <Navigate to="/admin" replace />;
      }
      
      // Si es usuario normal, va a home
      return <Navigate to="/home" replace />;
    } catch (error) {
      // Si hay error, permitir acceso a la ruta pública
      return children;
    }
  }

  // Si no está autenticado, mostrar la ruta pública
  return children;
};

export default PublicRoute;