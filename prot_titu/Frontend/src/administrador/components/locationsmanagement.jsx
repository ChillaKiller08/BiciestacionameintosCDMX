// LocationsManagement.jsx
import React, { useState, useEffect } from 'react';
import './locationsmanagement.css';

const LocationsManagement = () => {
  const [locations, setLocations] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Cargar ubicaciones al montar el componente
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetch('http://localhost:5000/api/biciestacionamientos');
      const data = await response.json();

      if (data.success) {
        setLocations(data.biciestacionamientos);
      } else {
        setError(data.message || 'Error al cargar ubicaciones');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const filteredLocations = locations.filter(location =>
    location.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.ubicacion.delegacion.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.ubicacion.colonia.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (location) => {
    setSelectedLocation({
      ...location,
      lat: location.ubicacion.coordenadas.coordinates[1],
      lng: location.ubicacion.coordenadas.coordinates[0]
    });
    setIsEditing(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar esta ubicación?')) {
      try {
        const token = localStorage.getItem('token');

        const response = await fetch(`http://localhost:5000/api/biciestacionamientos/${id}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (data.success) {
          setLocations(locations.filter(loc => loc._id !== id));
          alert('Ubicación eliminada exitosamente');
        } else {
          alert(data.message || 'Error al eliminar ubicación');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión con el servidor');
      }
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');

      const response = await fetch(`http://localhost:5000/api/biciestacionamientos/${selectedLocation._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: selectedLocation.nombre,
          ubicacion: {
            direccion: selectedLocation.ubicacion.direccion,
            delegacion: selectedLocation.ubicacion.delegacion,
            colonia: selectedLocation.ubicacion.colonia,
            codigoPostal: selectedLocation.ubicacion.codigoPostal,
            coordenadas: {
              lat: parseFloat(selectedLocation.lat),
              lng: parseFloat(selectedLocation.lng)
            }
          },
          horario: selectedLocation.horario,
          dias: selectedLocation.dias,
          capacidad: parseInt(selectedLocation.capacidad),
          tipo: selectedLocation.tipo,
          requisitos: selectedLocation.requisitos,
          foto: selectedLocation.foto,
          descripcion: selectedLocation.descripcion
        })
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar la lista local
        setLocations(locations.map(loc =>
          loc._id === selectedLocation._id ? data.biciestacionamiento : loc
        ));
        setIsEditing(false);
        setSelectedLocation(null);
        alert('Ubicación actualizada exitosamente');
      } else {
        alert(data.message || 'Error al actualizar ubicación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  };

  // Estado de carga
  if (loading) {
    return (
      <div className="locations-management">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Cargando ubicaciones...</p>
        </div>
      </div>
    );
  }

  // Estado de error
  if (error) {
    return (
      <div className="locations-management">
        <div className="error-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>Error al cargar ubicaciones</h3>
          <p>{error}</p>
          <button onClick={fetchLocations} className="btn-retry">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="locations-management">
      <div className="section-header">
        <h2>Gestión de Ubicaciones</h2>
        <span className="badge">{locations.length}</span>
      </div>

      <div className="search-bar-admin">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input
          type="text"
          placeholder="Buscar por nombre, delegación o colonia..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredLocations.length === 0 && !loading ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <h3>No hay ubicaciones registradas</h3>
          <p>Comienza agregando una nueva ubicación desde el panel de administración</p>
        </div>
      ) : (
        <div className="locations-grid">
          {filteredLocations.map(location => (
            <div key={location._id} className="location-card">
              <div className="location-image">
                <img src={location.foto} alt={location.nombre} />
                <span className={`status-badge ${location.status}`}>
                  {location.status === 'active' ? 'Activo' : location.status === 'inactive' ? 'Inactivo' : 'Mantenimiento'}
                </span>
              </div>

              <div className="location-info">
                <h3>{location.nombre}</h3>
                <div className="location-detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{location.ubicacion.direccion}, {location.ubicacion.colonia}</span>
                </div>
                <div className="location-detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                  <span>{location.horario}</span>
                </div>
                <div className="location-detail">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                  </svg>
                  <span>{location.capacidad} espacios - {location.tipo}</span>
                </div>
              </div>

              <div className="location-actions">
                <button 
                  className="btn-edit"
                  onClick={() => handleEdit(location)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                  Editar
                </button>
                <button 
                  className="btn-delete"
                  onClick={() => handleDelete(location._id)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición */}
      {isEditing && selectedLocation && (
        <div className="modal-overlay" onClick={() => setIsEditing(false)}>
          <div className="edit-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Editar Ubicación</h2>
              <button 
                className="modal-close"
                onClick={() => setIsEditing(false)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <div className="form-group">
                <label>Nombre del Biciestacionamiento</label>
                <input
                  type="text"
                  value={selectedLocation.nombre}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    nombre: e.target.value
                  })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Delegación</label>
                  <input
                    type="text"
                    value={selectedLocation.ubicacion.delegacion}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      ubicacion: {
                        ...selectedLocation.ubicacion,
                        delegacion: e.target.value
                      }
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Colonia</label>
                  <input
                    type="text"
                    value={selectedLocation.ubicacion.colonia}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      ubicacion: {
                        ...selectedLocation.ubicacion,
                        colonia: e.target.value
                      }
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Dirección</label>
                <input
                  type="text"
                  value={selectedLocation.ubicacion.direccion}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    ubicacion: {
                      ...selectedLocation.ubicacion,
                      direccion: e.target.value
                    }
                  })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Latitud</label>
                  <input
                    type="number"
                    step="any"
                    value={selectedLocation.lat}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      lat: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Longitud</label>
                  <input
                    type="number"
                    step="any"
                    value={selectedLocation.lng}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      lng: e.target.value
                    })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Horario</label>
                <input
                  type="text"
                  value={selectedLocation.horario}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    horario: e.target.value
                  })}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Capacidad</label>
                  <input
                    type="number"
                    value={selectedLocation.capacidad}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      capacidad: e.target.value
                    })}
                  />
                </div>
                <div className="form-group">
                  <label>Tipo de Acceso</label>
                  <select
                    value={selectedLocation.tipo}
                    onChange={(e) => setSelectedLocation({
                      ...selectedLocation,
                      tipo: e.target.value
                    })}
                  >
                    <option value="Público">Público</option>
                    <option value="Privado">Privado</option>
                    <option value="Restringido">Restringido</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Foto (URL)</label>
                <input
                  type="url"
                  value={selectedLocation.foto}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    foto: e.target.value
                  })}
                />
              </div>

              <div className="form-group">
                <label>Descripción</label>
                <textarea
                  rows="3"
                  value={selectedLocation.descripcion || ''}
                  onChange={(e) => setSelectedLocation({
                    ...selectedLocation,
                    descripcion: e.target.value
                  })}
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-cancel"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
                <button 
                  className="btn-save"
                  onClick={handleSave}
                >
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsManagement;