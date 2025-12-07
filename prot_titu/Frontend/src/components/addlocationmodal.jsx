// addlocationmodal.jsx
import React, { useState, useEffect } from 'react';
import ImageUploader from './imageuploader/imageuploader';
import './addlocationmodal.css';

const AddLocationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    colonia: '',
    delegacion: '',
    lat: '',
    lng: '',
    horario: '',
    dias: [],
    capacidad: '',
    tipo: '',
    requisitos: '',
    descripcion: '',
    foto: '' // 👈 Ahora es string (URL de Cloudinary)
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [map, setMap] = useState(null);
  const [marker, setMarker] = useState(null);

  const delegaciones = [
    'Álvaro Obregón', 'Azcapotzalco', 'Benito Juárez', 'Coyoacán',
    'Cuajimalpa', 'Cuauhtémoc', 'Gustavo A. Madero', 'Iztacalco',
    'Iztapalapa', 'Magdalena Contreras', 'Miguel Hidalgo', 'Milpa Alta',
    'Tláhuac', 'Tlalpan', 'Venustiano Carranza', 'Xochimilco'
  ];

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  // Inicializar mapa
  useEffect(() => {
    if (isOpen && window.google && !map) {
      setTimeout(() => {
        const mapElement = document.getElementById('proposal-map');
        
        if (mapElement) {
          const newMap = new window.google.maps.Map(mapElement, {
            center: { lat: 19.432608, lng: -99.133209 },
            zoom: 12
          });

          newMap.addListener('click', (e) => {
            if (marker) marker.setMap(null);
            
            const newMarker = new window.google.maps.Marker({
              position: e.latLng,
              map: newMap,
              draggable: true
            });

            setFormData(prev => ({
              ...prev,
              lat: e.latLng.lat().toFixed(6),
              lng: e.latLng.lng().toFixed(6)
            }));

            newMarker.addListener('dragend', (ev) => {
              setFormData(prev => ({
                ...prev,
                lat: ev.latLng.lat().toFixed(6),
                lng: ev.latLng.lng().toFixed(6)
              }));
            });

            setMarker(newMarker);
          });

          setMap(newMap);
        }
      }, 500);
    }
  }, [isOpen, map, marker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 👇 NUEVO: Recibir URL de Cloudinary
  const handleImageUploaded = (url) => {
    setFormData(prev => ({ ...prev, foto: url }));
    setErrors(prev => ({ ...prev, foto: null }));
  };

  const handleDiasChange = (dia) => {
    setFormData(prev => ({
      ...prev,
      dias: prev.dias.includes(dia) ? prev.dias.filter(d => d !== dia) : [...prev.dias, dia]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre.trim()) newErrors.nombre = 'Requerido';
    if (!formData.direccion.trim()) newErrors.direccion = 'Requerido';
    if (!formData.colonia.trim()) newErrors.colonia = 'Requerido';
    if (!formData.delegacion) newErrors.delegacion = 'Requerido';
    if (!formData.horario.trim()) newErrors.horario = 'Requerido';
    if (formData.dias.length === 0) newErrors.dias = 'Selecciona días';
    if (!formData.capacidad || formData.capacidad < 1) newErrors.capacidad = 'Requerido';
    if (!formData.tipo) newErrors.tipo = 'Requerido';
    if (!formData.lat || !formData.lng) newErrors.ubicacion = 'Selecciona en el mapa';
    if (!formData.foto) newErrors.foto = 'Sube una imagen';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // 👇 CAMBIO: Ahora enviamos JSON en lugar de FormData
      const response = await fetch('http://localhost:5000/api/propuestas', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData) // 👈 Enviar como JSON
      });

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setTimeout(handleClose, 2500);
      } else {
        setErrors({ submit: data.message });
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión' });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (marker) marker.setMap(null);
    setMap(null);
    setMarker(null);
    setFormData({
      nombre: '', direccion: '', colonia: '', delegacion: '',
      lat: '', lng: '', horario: '', dias: [], capacidad: '',
      tipo: '', requisitos: '', descripcion: '', foto: ''
    });
    setErrors({});
    setSuccess(false);
    onClose();
  };

  if (!isOpen) return null;

  if (success) {
    return (
      <div className="modal-overlay" onClick={handleClose}>
        <div className="modal-success" onClick={(e) => e.stopPropagation()}>
          <div className="success-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#28a745" strokeWidth="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h2>¡Propuesta Enviada!</h2>
          <p>Será revisada por un administrador.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="add-bici-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Proponer Biciestacionamiento</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>

        <form className="add-bici-form" onSubmit={handleSubmit}>
          {errors.submit && <div className="error-message">{errors.submit}</div>}

          {/* Información básica */}
          <div className="form-section">
            <h3>Información Básica</h3>
            <div className="form-group">
              <label>Nombre *</label>
              <input type="text" name="nombre" value={formData.nombre} onChange={handleChange} placeholder="Ej: Biciestacionamiento Metro Chapultepec" />
              {errors.nombre && <span className="error-text">{errors.nombre}</span>}
            </div>
            <div className="form-group">
              <label>Descripción</label>
              <textarea name="descripcion" value={formData.descripcion} onChange={handleChange} rows="3" />
            </div>
          </div>

          {/* Ubicación */}
          <div className="form-section">
            <h3>Ubicación</h3>
            <div className="form-group">
              <label>Dirección *</label>
              <input type="text" name="direccion" value={formData.direccion} onChange={handleChange} placeholder="Ej: Av. Chapultepec 123" />
              {errors.direccion && <span className="error-text">{errors.direccion}</span>}
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Delegación *</label>
                <select name="delegacion" value={formData.delegacion} onChange={handleChange}>
                  <option value="">Selecciona una delegación</option>
                  {delegaciones.map(del => <option key={del} value={del}>{del}</option>)}
                </select>
                {errors.delegacion && <span className="error-text">{errors.delegacion}</span>}
              </div>
              <div className="form-group">
                <label>Colonia *</label>
                <input type="text" name="colonia" value={formData.colonia} onChange={handleChange} placeholder="Ej: Juárez" />
                {errors.colonia && <span className="error-text">{errors.colonia}</span>}
              </div>
            </div>
          </div>

          {/* MAPA */}
          <div className="form-section">
            <h3>Ubicación en el Mapa *</h3>
            <p style={{fontSize: '14px', color: '#666', marginBottom: '10px'}}>
              👆 Haz clic en el mapa para marcar la ubicación exacta
            </p>
            <div id="proposal-map" style={{
              width: '100%',
              height: '400px',
              borderRadius: '8px',
              border: '2px solid #E0E0E0',
              marginBottom: '10px'
            }}></div>
            {formData.lat && formData.lng && (
              <div style={{padding: '10px', background: '#f0f0f0', borderRadius: '6px', fontSize: '13px'}}>
                📍 Lat: {formData.lat} | Lng: {formData.lng}
              </div>
            )}
            {errors.ubicacion && <span className="error-text">{errors.ubicacion}</span>}
          </div>

          {/* Horarios */}
          <div className="form-section">
            <h3>Horario y Disponibilidad</h3>
            <div className="form-group">
              <label>Horario *</label>
              <input type="text" name="horario" value={formData.horario} onChange={handleChange} placeholder="Ej: 6:00 AM - 10:00 PM" />
              {errors.horario && <span className="error-text">{errors.horario}</span>}
            </div>
            <div className="form-group">
              <label>Días Disponibles *</label>
              <div className="dias-grid">
                {diasSemana.map(dia => (
                  <label key={dia} className="dia-checkbox">
                    <input type="checkbox" checked={formData.dias.includes(dia)} onChange={() => handleDiasChange(dia)} />
                    <span>{dia}</span>
                  </label>
                ))}
              </div>
              {errors.dias && <span className="error-text">{errors.dias}</span>}
            </div>
          </div>

          {/* Características */}
          <div className="form-section">
            <h3>Características</h3>
            <div className="form-row">
              <div className="form-group">
                <label>Capacidad *</label>
                <input type="number" name="capacidad" value={formData.capacidad} onChange={handleChange} min="1" placeholder="Ej: 20" />
                {errors.capacidad && <span className="error-text">{errors.capacidad}</span>}
              </div>
              <div className="form-group">
                <label>Tipo *</label>
                <select name="tipo" value={formData.tipo} onChange={handleChange}>
                  <option value="">Selecciona</option>
                  <option value="Público">Público</option>
                  <option value="Privado">Privado</option>
                  <option value="Restringido">Restringido</option>
                </select>
                {errors.tipo && <span className="error-text">{errors.tipo}</span>}
              </div>
            </div>
            <div className="form-group">
              <label>Requisitos</label>
              <textarea name="requisitos" value={formData.requisitos} onChange={handleChange} rows="2" />
            </div>

            {/* 👇 IMAGEN CON CLOUDINARY */}
            <div className="form-group">
              <label>Fotografía *</label>
              <ImageUploader 
                onImageUploaded={handleImageUploaded}
                currentImage={formData.foto}
              />
              {errors.foto && <span className="error-text">{errors.foto}</span>}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={handleClose} disabled={loading}>Cancelar</button>
            <button type="submit" className="btn-submit" disabled={loading}>
              {loading ? 'Enviando...' : 'Enviar Propuesta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;