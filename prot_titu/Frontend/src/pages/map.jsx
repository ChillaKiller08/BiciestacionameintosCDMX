// Map.jsx
import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import './map.css';

const mapStyles = {
  height: "100%",
  width: "100%"
};

const defaultCenter = {
  lat: 19.445360,
  lng: -99.152241
};

const mapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
};

const Map = () => {
  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;
  const [biciestacionamientos, setBiciestacionamientos] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);

  useEffect(() => {
    fetchBiciestacionamientos();
  }, []);

  const fetchBiciestacionamientos = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/biciestacionamientos?status=active');
      const data = await response.json();

      if (data.success) {
        setBiciestacionamientos(data.biciestacionamientos);
      }
    } catch (error) {
      console.error('Error al cargar biciestacionamientos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLocationClick = (bici) => {
    setSelectedLocation(bici);
    setShowDetailView(true);
    setIsSidebarOpen(true);
    if (mapInstance) {
      mapInstance.panTo({
        lat: bici.ubicacion.coordenadas.coordinates[1],
        lng: bici.ubicacion.coordenadas.coordinates[0]
      });
      mapInstance.setZoom(16);
    }
  };

  const handleCloseDetailView = () => {
    setShowDetailView(false);
    setSelectedLocation(null);
  };

  if (!apiKey) {
    return (
      <div style={{ 
        height: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        color: '#B32134',
        fontSize: '16px',
        fontWeight: '600'
      }}>
        Error: No se encontró la API Key
      </div>
    );
  }

  return (
    <>
      {/* Botón toggle sidebar - solo visible cuando NO hay detalle */}
      {!showDetailView && (
        <button 
          className={`sidebar-toggle-btn ${isSidebarOpen ? 'open' : ''}`}
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <line x1="9" y1="3" x2="9" y2="21"></line>
          </svg>
          <span>{isSidebarOpen ? 'Ocultar' : 'Ver'} Lista</span>
        </button>
      )}

      {/* Sidebar - Vista de lista (todos los biciestacionamientos) */}
      {!showDetailView && (
        <div className={`map-sidebar ${isSidebarOpen ? 'open' : ''}`}>
          <div className="sidebar-header">
            <h2>Biciestacionamientos</h2>
            <span className="count-badge">{biciestacionamientos.length}</span>
          </div>

          {loading ? (
            <div className="sidebar-loading">
              <div className="spinner"></div>
              <p>Cargando ubicaciones...</p>
            </div>
          ) : (
            <div className="sidebar-list">
              {biciestacionamientos.map((bici) => (
                <div 
                  key={bici._id} 
                  className="location-item"
                  onClick={() => handleLocationClick(bici)}
                >
                  <div className="location-item-image">
                    <img src={bici.foto} alt={bici.nombre} />
                    <span className={`status-badge ${bici.status}`}>
                      {bici.status === 'active' ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div className="location-item-content">
                    <h3>{bici.nombre}</h3>
                    <div className="location-item-detail">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                      <span>{bici.ubicacion.colonia}, {bici.ubicacion.delegacion}</span>
                    </div>
                    <div className="location-item-detail">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>{bici.horario}</span>
                    </div>
                    <div className="location-item-footer">
                      <span className="capacity">{bici.capacidad} espacios</span>
                      <span className="type">{bici.tipo}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sidebar - Vista de detalle (solo el seleccionado) */}
      {showDetailView && selectedLocation && (
        <div className="map-sidebar detail-view open">
          <div className="sidebar-header">
            <button 
              className="back-button"
              onClick={handleCloseDetailView}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
              <span>Volver</span>
            </button>
          </div>

          <div className="detail-content">
            <div className="detail-image">
              <img src={selectedLocation.foto} alt={selectedLocation.nombre} />
              <span className={`status-badge ${selectedLocation.status}`}>
                {selectedLocation.status === 'active' ? 'Activo' : 'Inactivo'}
              </span>
            </div>

            <div className="detail-info">
              <h2>{selectedLocation.nombre}</h2>

              <div className="detail-section">
                <div className="detail-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <div>
                    <strong>Dirección</strong>
                    <p>{selectedLocation.ubicacion.direccion}, {selectedLocation.ubicacion.colonia}, {selectedLocation.ubicacion.delegacion}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <div>
                    <strong>Horario</strong>
                    <p>{selectedLocation.horario}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </svg>
                  <div>
                    <strong>Días</strong>
                    <p>{selectedLocation.dias.join(', ')}</p>
                  </div>
                </div>

                <div className="detail-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"></path>
                  </svg>
                  <div>
                    <strong>Capacidad</strong>
                    <p>{selectedLocation.capacidad} espacios disponibles</p>
                  </div>
                </div>

                <div className="detail-item">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <div>
                    <strong>Tipo</strong>
                    <p>{selectedLocation.tipo}</p>
                  </div>
                </div>

                {selectedLocation.requisitos && selectedLocation.requisitos !== 'Ninguno' && (
                  <div className="detail-item">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="16" x2="12" y2="12"></line>
                      <line x1="12" y1="8" x2="12.01" y2="8"></line>
                    </svg>
                    <div>
                      <strong>Requisitos</strong>
                      <p className="requisitos">{selectedLocation.requisitos}</p>
                    </div>
                  </div>
                )}

                {selectedLocation.descripcion && (
                  <div className="detail-item description">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                      <polyline points="14 2 14 8 20 8"></polyline>
                      <line x1="16" y1="13" x2="8" y2="13"></line>
                      <line x1="16" y1="17" x2="8" y2="17"></line>
                      <polyline points="10 9 9 9 8 9"></polyline>
                    </svg>
                    <div>
                      <strong>Descripción</strong>
                      <p>{selectedLocation.descripcion}</p>
                    </div>
                  </div>
                )}
              </div>

              <button 
                className="btn-directions-full"
                onClick={() => {
                  const lat = selectedLocation.ubicacion.coordenadas.coordinates[1];
                  const lng = selectedLocation.ubicacion.coordenadas.coordinates[0];
                  window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                </svg>
                Cómo llegar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overlay */}
      {(isSidebarOpen || showDetailView) && (
        <div 
          className="sidebar-overlay"
          onClick={() => {
            if (showDetailView) {
              handleCloseDetailView();
            } else {
              setIsSidebarOpen(false);
            }
          }}
        />
      )}

      {/* Mapa */}
      <LoadScript googleMapsApiKey={apiKey}>
        <GoogleMap
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          options={mapOptions}
          onLoad={(map) => setMapInstance(map)}
        >
          {biciestacionamientos.map((bici) => (
            <Marker
              key={bici._id}
              position={{
                lat: bici.ubicacion.coordenadas.coordinates[1],
                lng: bici.ubicacion.coordenadas.coordinates[0]
              }}
              onClick={() => handleLocationClick(bici)}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new window.google.maps.Size(40, 40)
              }}
            />
          ))}

          {selectedLocation && showDetailView && (
            <InfoWindow
              position={{
                lat: selectedLocation.ubicacion.coordenadas.coordinates[1],
                lng: selectedLocation.ubicacion.coordenadas.coordinates[0]
              }}
              onCloseClick={handleCloseDetailView}
            >
              <div className="info-window">
                <div className="info-window-header">
                  <h3>{selectedLocation.nombre}</h3>
                  <span className={`status-badge ${selectedLocation.status}`}>
                    {selectedLocation.status === 'active' ? 'Activo' : 'Inactivo'}
                  </span>
                </div>

                {selectedLocation.foto && (
                  <div className="info-window-image">
                    <img src={selectedLocation.foto} alt={selectedLocation.nombre} />
                  </div>
                )}

                <div className="info-window-content">
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{selectedLocation.ubicacion.direccion}, {selectedLocation.ubicacion.colonia}, {selectedLocation.ubicacion.delegacion}</span>
                  </div>

                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{selectedLocation.horario}</span>
                  </div>

                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    <span>{selectedLocation.dias.join(', ')}</span>
                  </div>

                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"></path>
                    </svg>
                    <span>{selectedLocation.capacidad} espacios disponibles</span>
                  </div>

                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <span>{selectedLocation.tipo}</span>
                  </div>

                  {selectedLocation.requisitos && selectedLocation.requisitos !== 'Ninguno' && (
                    <div className="info-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="16" x2="12" y2="12"></line>
                        <line x1="12" y1="8" x2="12.01" y2="8"></line>
                      </svg>
                      <span className="requisitos">{selectedLocation.requisitos}</span>
                    </div>
                  )}

                  {selectedLocation.descripcion && (
                    <div className="info-description">
                      <p>{selectedLocation.descripcion}</p>
                    </div>
                  )}
                </div>

                <div className="info-window-footer">
                  <button className="btn-directions" onClick={() => {
                    const lat = selectedLocation.ubicacion.coordenadas.coordinates[1];
                    const lng = selectedLocation.ubicacion.coordenadas.coordinates[0];
                    window.open(`https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`, '_blank');
                  }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
                    </svg>
                    Cómo llegar
                  </button>
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </LoadScript>
    </>
  );
};

export default Map;