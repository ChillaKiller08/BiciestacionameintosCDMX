// navbar.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userName, setUserName] = useState('Ciclista');
  const navigate = useNavigate();

  useEffect(() => {
    const userDataString = localStorage.getItem('user');
    
    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleProfile = () => {
    setMenuOpen(false);
    navigate('/perfil');
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
          <button onClick={handleProfile} className="menu-item">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
            Mi Perfil
          </button>
          <button onClick={handleLogout} className="menu-item logout">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
            Cerrar Sesión
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;