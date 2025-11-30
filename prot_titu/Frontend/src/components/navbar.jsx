// navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Ciclista');
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los datos del usuario desde localStorage
    const userDataString = localStorage.getItem('user');
    
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        // Usar el nombre del usuario, o 'Ciclista' por defecto
        setUserName(userData.nombre || 'Ciclista');
      } catch (error) {
        console.error('Error al parsear datos del usuario:', error);
        setUserName('Ciclista');
      }
    }
  }, []);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirigir al login
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="user-section">
          <div className="user-icon">
            <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#B32134" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </div>
          <span className="user-label">{userName}</span>
        </div>

        <button className="menu-toggle" onClick={toggleMenu}>
          <div className={`hamburger ${menuOpen ? 'open' : ''}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>
      </div>

      {menuOpen && (
        <div className="dropdown-menu">
          <a href="/perfil">Mi Perfil</a>
          <a href="/mis-rutas">Mis Rutas</a>
          <a href="/configuracion">Configuración</a>
          <button onClick={handleLogout} className="logout-link">
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;