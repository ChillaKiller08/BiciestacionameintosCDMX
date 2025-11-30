// LocationRequests.jsx
import React, { useState } from 'react';
import './locationrequests.css';

const LocationRequests = () => {
  // Datos de ejemplo (después vendrían del backend)
  const [requests, setRequests] = useState([
    {
      id: 1,
      nombre: 'Biciestacionamiento Metro Insurgentes',
      usuario: 'Juan Pérez',
      email: 'juan@example.com',
      delegacion: 'Cuauhtémoc',
      colonia: 'Roma Norte',
      calle: 'Av. Insurgentes Sur',
      numero: '123',
      descripcion: 'Biciestacionamiento seguro cerca del metro, con 20 espacios techados.',
      horario: 'Lunes a Domingo 6:00 - 22:00',
      capacidad: '20',
      tipoAcceso: 'Público',
      foto: 'https://via.placeholder.com/300x200',
      fecha: '2025-01-15',
      status: 'pending'
    },
    {
      id: 2,
      nombre: 'Estacionamiento Parque México',
      usuario: 'María González',
      email: 'maria@example.com',
      delegacion: 'Cuauhtémoc',
      colonia: 'Condesa',
      calle: 'Av. México',
      numero: 'S/N',
      descripcion: 'Ubicado en la entrada del parque, acceso gratuito.',
      horario: '24 horas',
      capacidad: '15',
      tipoAcceso: 'Público',
      foto: 'https://via.placeholder.com/300x200',
      fecha: '2025-01-14',
      status: 'pending'
    }
  ]);

  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');

  const handleApprove = (id) => {
    if (window.confirm('¿Estás seguro de aprobar esta ubicación?')) {
      setRequests(requests.filter(req => req.id !== id));
      setSelectedRequest(null);
      alert('Ubicación aprobada exitosamente');
    }
  };

  const handleReject = (id) => {
    if (!rejectReason.trim()) {
      alert('Por favor, especifica el motivo del rechazo');
      return;
    }

    if (window.confirm('¿Estás seguro de rechazar esta ubicación?')) {
      setRequests(requests.filter(req => req.id !== id));
      setSelectedRequest(null);
      setRejectReason('');
      alert('Ubicación rechazada');
    }
  };

  return (
    <div className="location-requests">
      <div className="section-header">
        <h2>Peticiones Pendientes</h2>
        <span className="badge">{requests.length}</span>
      </div>

      {requests.length === 0 ? (
        <div className="empty-state">
          <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
          <h3>No hay peticiones pendientes</h3>
          <p>Todas las solicitudes han sido procesadas</p>
        </div>
      ) : (
        <div className="requests-grid">
          {requests.map(request => (
            <div key={request.id} className="request-card">
              <div className="request-image">
                <img src={request.foto} alt={request.nombre} />
                <span className="request-date">{request.fecha}</span>
              </div>

              <div className="request-info">
                <h3>{request.nombre}</h3>
                <div className="request-location">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <span>{request.calle} {request.numero}, {request.colonia}, {request.delegacion}</span>
                </div>
                <div className="request-user">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <span>{request.usuario} ({request.email})</span>
                </div>
              </div>

              <div className="request-actions">
                <button 
                  className="btn-details"
                  onClick={() => setSelectedRequest(request)}
                >
                  Ver Detalles
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalles */}
      {selectedRequest && (
        <div className="modal-overlay" onClick={() => setSelectedRequest(null)}>
          <div className="request-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Detalles de la Solicitud</h2>
              <button 
                className="modal-close"
                onClick={() => setSelectedRequest(null)}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            <div className="modal-content">
              <div className="detail-image">
                <img src={selectedRequest.foto} alt={selectedRequest.nombre} />
              </div>

              <div className="detail-section">
                <h3>Información General</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Nombre:</label>
                    <span>{selectedRequest.nombre}</span>
                  </div>
                  <div className="detail-item">
                    <label>Delegación:</label>
                    <span>{selectedRequest.delegacion}</span>
                  </div>
                  <div className="detail-item">
                    <label>Colonia:</label>
                    <span>{selectedRequest.colonia}</span>
                  </div>
                  <div className="detail-item">
                    <label>Calle y Número:</label>
                    <span>{selectedRequest.calle} {selectedRequest.numero}</span>
                  </div>
                  <div className="detail-item">
                    <label>Horario:</label>
                    <span>{selectedRequest.horario}</span>
                  </div>
                  <div className="detail-item">
                    <label>Capacidad:</label>
                    <span>{selectedRequest.capacidad} bicicletas</span>
                  </div>
                  <div className="detail-item">
                    <label>Tipo de Acceso:</label>
                    <span>{selectedRequest.tipoAcceso}</span>
                  </div>
                  <div className="detail-item">
                    <label>Fecha de Solicitud:</label>
                    <span>{selectedRequest.fecha}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Descripción</h3>
                <p>{selectedRequest.descripcion}</p>
              </div>

              <div className="detail-section">
                <h3>Información del Usuario</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <label>Nombre:</label>
                    <span>{selectedRequest.usuario}</span>
                  </div>
                  <div className="detail-item">
                    <label>Email:</label>
                    <span>{selectedRequest.email}</span>
                  </div>
                </div>
              </div>

              <div className="detail-section">
                <h3>Motivo de Rechazo (opcional)</h3>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Especifica el motivo si vas a rechazar esta solicitud..."
                  rows="3"
                />
              </div>

              <div className="modal-actions">
                <button 
                  className="btn-reject"
                  onClick={() => handleReject(selectedRequest.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                  Rechazar
                </button>
                <button 
                  className="btn-approve"
                  onClick={() => handleApprove(selectedRequest.id)}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                  Aprobar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationRequests;