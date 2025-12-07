// adminpropuestas.jsx
import React, { useState, useEffect } from 'react';
import './adminpropuestas.css';

const AdminPropuestas = () => {
  const [propuestas, setPropuestas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPropuesta, setSelectedPropuesta] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [motivoRechazo, setMotivoRechazo] = useState('');

  useEffect(() => {
    fetchPropuestas();
  }, []);

  const fetchPropuestas = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/propuestas?status=pendiente`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setPropuestas(data.propuestas);
      }
    } catch (error) {
      console.error('Error al cargar propuestas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAprobar = async (id) => {
    if (!window.confirm('¿Estás seguro de aprobar esta propuesta? Se creará un nuevo biciestacionamiento.')) return;

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/propuestas/${id}/aprobar`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Propuesta aprobada y biciestacionamiento creado exitosamente');
        fetchPropuestas();
      } else {
        alert('❌ ' + (data.message || 'Error al aprobar propuesta'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al aprobar propuesta');
    }
  };

  const handleRechazar = async () => {
    if (!motivoRechazo.trim()) {
      alert('⚠️ Debes especificar un motivo de rechazo');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:5000/api/propuestas/${selectedPropuesta._id}/rechazar`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ motivo: motivoRechazo })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Propuesta rechazada');
        setShowRejectModal(false);
        setMotivoRechazo('');
        setSelectedPropuesta(null);
        fetchPropuestas();
      } else {
        alert('❌ ' + (data.message || 'Error al rechazar propuesta'));
      }
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Error al rechazar propuesta');
    }
  };

  const openRejectModal = (propuesta) => {
    setSelectedPropuesta(propuesta);
    setShowRejectModal(true);
  };

  return (
    <div className="admin-propuestas-container">
      <div className="propuestas-header">
        <h1>Propuestas Pendientes</h1>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando propuestas...</p>
        </div>
      ) : propuestas.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          <h3>No hay propuestas pendientes</h3>
        </div>
      ) : (
        <div className="propuestas-grid">
          {propuestas.map((propuesta) => (
            <div key={propuesta._id} className="propuesta-card">
              <div className="card-image">
                <img src={`http://localhost:5000${propuesta.foto}`} alt={propuesta.nombre} />
                <span className="status-badge badge-pending">Pendiente</span>
              </div>

              <div className="card-content">
                <h3>{propuesta.nombre}</h3>
                
                <div className="card-info">
                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span>{propuesta.ubicacion.colonia}, {propuesta.ubicacion.delegacion}</span>
                  </div>

                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                    <span>{propuesta.propuestaPor?.name || 'Usuario'}</span>
                  </div>

                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10"></circle>
                      <polyline points="12 6 12 12 16 14"></polyline>
                    </svg>
                    <span>{propuesta.horario}</span>
                  </div>

                  <div className="info-item">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3M2 12h20M12 2v20"></path>
                    </svg>
                    <span>{propuesta.capacidad} espacios - {propuesta.tipo}</span>
                  </div>
                </div>

                <div className="card-actions">
                  <button
                    className="btn-approve"
                    onClick={() => handleAprobar(propuesta._id)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                    Aprobar
                  </button>
                  <button
                    className="btn-reject"
                    onClick={() => openRejectModal(propuesta)}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                    Rechazar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de Rechazo */}
      {showRejectModal && (
        <div className="modal-overlay" onClick={() => setShowRejectModal(false)}>
          <div className="reject-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Rechazar Propuesta</h2>
            <p>Proporciona un motivo para el rechazo:</p>
            <textarea
              value={motivoRechazo}
              onChange={(e) => setMotivoRechazo(e.target.value)}
              placeholder="Ej: La ubicación no cumple con los requisitos..."
              rows="4"
            />
            <div className="modal-actions">
              <button onClick={() => setShowRejectModal(false)}>Cancelar</button>
              <button className="btn-reject" onClick={handleRechazar}>Rechazar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPropuestas;