// main.jsx (Home.jsx)
import React, { useState, useEffect } from 'react';
import Navbar from '../components/navbar.jsx';
import SearchBar from '../components/searchbar.jsx';
import FilterButton from '../components/filterbutton.jsx';
import Map from './map.jsx';
import AddLocationButton from '../components/addlocationbutton.jsx';
import AddLocationModal from '../components/addlocationmodal.jsx';
import './main.css';

const Home = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    // Esperar a que el mapa esté listo
    const timer = setTimeout(() => {
      setIsPageReady(true);
    }, 1500); // 1.5 segundos para dar tiempo al mapa

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = (searchTerm) => {
    console.log('Buscando:', searchTerm);
    // Aquí irá tu lógica de búsqueda
  };

  const handleFilter = () => {
    console.log('Abrir filtros');
    // Aquí irá tu lógica de filtros
  };

  const handleAddLocation = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {/* Loading Overlay - se muestra encima mientras carga */}
      {!isPageReady && (
        <div className="loading-overlay">
          <div className="loading-content">
            <div className="spinner"></div>
            <h2>Cargando Mapa</h2>
            <p>Un momento...</p>
          </div>
        </div>
      )}

      {/* Contenido principal - siempre renderizado */}
      <div className={`home-container ${isPageReady ? 'ready' : ''}`}>
        <Navbar />
        
        <div className="search-section">
          <SearchBar onSearch={handleSearch} />
          <FilterButton onClick={handleFilter} />
        </div>

        <div className="map-container">
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