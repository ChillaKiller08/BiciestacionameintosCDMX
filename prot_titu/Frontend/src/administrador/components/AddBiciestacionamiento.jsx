// AddBiciestacionamiento.jsx
import React, { useState } from 'react';
import ImageUploader from '../../components/imageuploader/imageuploader';
import './addbiciestacionamiento.css';

const AddBiciestacionamiento = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    delegacion: '',
    colonia: '',
    codigoPostal: '',
    lat: '',
    lng: '',
    horario: '',
    dias: [],
    capacidad: '',
    tipo: 'Público',
    requisitos: '',
    foto: '', // 👈 URL de Cloudinary
    descripcion: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const diasSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // 👇 NUEVO: Recibir URL de Cloudinary
  const handleImageUploaded = (url) => {
    setFormData(prev => ({ ...prev, foto: url }));
    setError('');
  };

  const handleDiasChange = (dia) => {
    if (formData.dias.includes(dia)) {
      setFormData({
        ...formData,
        dias: formData.dias.filter(d => d !== dia)
      });
    } else {
      setFormData({
        ...formData,
        dias: [...formData.dias, dia]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validaciones
    if (!formData.nombre || !formData.direccion || !formData.delegacion || !formData.colonia) {
      setError('Todos los campos obligatorios deben ser completados');
      return;
    }

    if (formData.dias.length === 0) {
      setError('Debes seleccionar al menos un día');
      return;
    }

    if (!formData.lat || !formData.lng) {
      setError('Las coordenadas son obligatorias');
      return;
    }

    if (!formData.foto) {
      setError('La foto es obligatoria');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');

      const response = await fetch('http://localhost:5000/api/biciestacionamientos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nombre: formData.nombre,
          ubicacion: {
            direccion: formData.direccion,
            delegacion: formData.delegacion,
            colonia: formData.colonia,
            codigoPostal: formData.codigoPostal,
            coordenadas: {
              type: 'Point',
              coordinates: [parseFloat(formData.lng), parseFloat(formData.lat)]
            }
          },
          horario: formData.horario,
          dias: formData.dias,
          capacidad: parseInt(formData.capacidad),
          tipo: formData.tipo,
          requisitos: formData.requisitos,
          foto: formData.foto, // 👈 URL de Cloudinary
          descripcion: formData.descripcion
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Biciestacionamiento registrado exitosamente');
        if (onSuccess) onSuccess();
        if (onClose) onClose();
      } else {
        setError(data.message || 'Error al registrar biciestacionamiento');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="add-bici-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Registrar Biciestacionamiento</h2>
          <button className="modal-close" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className="add-bici-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Información básica */}
          <div className="form-section">
            <h3>Información Básica</h3>
            
            <div className="form-group">
              <label htmlFor="nombre">Nombre *</label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                placeholder="Ej: Biciestacionamiento Centro Histórico"
                value={formData.nombre}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Descripción</label>
              <textarea
                id="descripcion"
                name="descripcion"
                placeholder="Descripción del biciestacionamiento..."
                value={formData.descripcion}
                onChange={handleChange}
                rows="3"
                disabled={loading}
              />
            </div>
          </div>

          {/* Ubicación */}
          <div className="form-section">
            <h3>Ubicación</h3>
            
            <div className="form-group">
              <label htmlFor="direccion">Dirección *</label>
              <input
                type="text"
                id="direccion"
                name="direccion"
                placeholder="Ej: Av. Juárez #50"
                value={formData.direccion}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="delegacion">Delegación *</label>
                <input
                  type="text"
                  id="delegacion"
                  name="delegacion"
                  placeholder="Ej: Cuauhtémoc"
                  value={formData.delegacion}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="colonia">Colonia *</label>
                <input
                  type="text"
                  id="colonia"
                  name="colonia"
                  placeholder="Ej: Centro"
                  value={formData.colonia}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="codigoPostal">Código Postal</label>
                <input
                  type="text"
                  id="codigoPostal"
                  name="codigoPostal"
                  placeholder="Ej: 06000"
                  value={formData.codigoPostal}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="lat">Latitud *</label>
                <input
                  type="number"
                  step="any"
                  id="lat"
                  name="lat"
                  placeholder="19.432608"
                  value={formData.lat}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="lng">Longitud *</label>
                <input
                  type="number"
                  step="any"
                  id="lng"
                  name="lng"
                  placeholder="-99.133209"
                  value={formData.lng}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Horarios y días */}
          <div className="form-section">
            <h3>Horario y Disponibilidad</h3>
            
            <div className="form-group">
              <label htmlFor="horario">Horario *</label>
              <input
                type="text"
                id="horario"
                name="horario"
                placeholder="Ej: Lunes a Viernes 7:00 - 20:00"
                value={formData.horario}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Días Disponibles *</label>
              <div className="dias-grid">
                {diasSemana.map(dia => (
                  <label key={dia} className="dia-checkbox">
                    <input
                      type="checkbox"
                      checked={formData.dias.includes(dia)}
                      onChange={() => handleDiasChange(dia)}
                      disabled={loading}
                    />
                    <span>{dia}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Capacidad y tipo */}
          <div className="form-section">
            <h3>Características</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="capacidad">Capacidad *</label>
                <input
                  type="number"
                  id="capacidad"
                  name="capacidad"
                  placeholder="Ej: 30"
                  min="1"
                  value={formData.capacidad}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="tipo">Tipo *</label>
                <select
                  id="tipo"
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                >
                  <option value="Público">Público</option>
                  <option value="Privado">Privado</option>
                  <option value="Restringido">Restringido</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="requisitos">Requisitos</label>
              <textarea
                id="requisitos"
                name="requisitos"
                placeholder="Ej: Candado propio, Registro previo, etc."
                value={formData.requisitos}
                onChange={handleChange}
                rows="2"
                disabled={loading}
              />
            </div>

            {/* 👇 IMAGEN CON CLOUDINARY */}
            <div className="form-group">
              <label>Fotografía *</label>
              <ImageUploader 
                onImageUploaded={handleImageUploaded}
                currentImage={formData.foto}
              />
            </div>
          </div>

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar Biciestacionamiento'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBiciestacionamiento;