// main.jsx (Home.jsx)
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar';
import Map from '../components/map';
import AddLocationButton from '../components/addlocationbutton';
import AddLocationModal from '../components/addlocationmodal';
import './main.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    // Esperar a que el mapa esté listo
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleAddLocation = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Loading Overlay */}
      {!isPageReady && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <h2>Cargando Mapa</h2>
            <p>Un momento...</p>
          </div>
        </div>
      )}

      {/* Contenido principal */}
      <div className={`home-container ${isPageReady ? 'ready' : ''}`}>
        <Navbar />
        
        {/* Map.jsx ya tiene SearchBar y FilterButton integrados */}
        <div className="map-wrapper">
          <Map />
        </div>

        <AddLocationButton onClick={handleAddLocation} />
        
        <AddLocationModal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
        />
      </div>
    </>
  );
};

export default Home;