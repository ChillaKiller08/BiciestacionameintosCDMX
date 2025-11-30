// AddLocationModal.jsx
import React, { useState } from 'react';
import './addlocationmodal.css';

const DELEGACIONES_CDMX = [
  'Álvaro Obregón',
  'Azcapotzalco',
  'Benito Juárez',
  'Coyoacán',
  'Cuajimalpa de Morelos',
  'Cuauhtémoc',
  'Gustavo A. Madero',
  'Iztacalco',
  'Iztapalapa',
  'La Magdalena Contreras',
  'Miguel Hidalgo',
  'Milpa Alta',
  'Tláhuac',
  'Tlalpan',
  'Venustiano Carranza',
  'Xochimilco'
];

const HORARIOS_PREDEFINIDOS = [
  '24 horas',
  'Lunes a Viernes 6:00 - 22:00',
  'Lunes a Viernes 7:00 - 20:00',
  'Lunes a Domingo 6:00 - 22:00',
  'Lunes a Domingo 7:00 - 21:00',
  'Personalizado'
];

const AddLocationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    delegacion: '',
    colonia: '',
    calle: '',
    numero: '',
    descripcion: '',
    horario: '',
    horarioPersonalizado: '',
    capacidad: '',
    tipoAcceso: 'publico',
    foto: null
  });

  const [fotoPreview, setFotoPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar que sea una imagen
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, foto: 'Solo se permiten imágenes' }));
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, foto: 'La imagen no debe superar 5MB' }));
        return;
      }

      setFormData(prev => ({ ...prev, foto: file }));
      
      // Crear preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      setErrors(prev => ({ ...prev, foto: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (!formData.delegacion) newErrors.delegacion = 'Selecciona una delegación';
    if (!formData.colonia.trim()) newErrors.colonia = 'La colonia es obligatoria';
    if (!formData.calle.trim()) newErrors.calle = 'La calle es obligatoria';
    if (!formData.descripcion.trim()) newErrors.descripcion = 'La descripción es obligatoria';
    if (!formData.horario) newErrors.horario = 'Selecciona un horario';
    if (formData.horario === 'Personalizado' && !formData.horarioPersonalizado.trim()) {
      newErrors.horarioPersonalizado = 'Especifica el horario';
    }
    if (!formData.foto) newErrors.foto = 'Agrega una foto del biciestacionamiento';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    // Aquí enviarías los datos al backend
    console.log('Datos del formulario:', formData);
    console.log('Foto:', formData.foto);

    // Simular envío exitoso
    alert('¡Biciestacionamiento agregado exitosamente!');
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      nombre: '',
      delegacion: '',
      colonia: '',
      calle: '',
      numero: '',
      descripcion: '',
      horario: '',
      horarioPersonalizado: '',
      capacidad: '',
      tipoAcceso: 'publico',
      foto: null
    });
    setFotoPreview(null);
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Agregar Biciestacionamiento</h2>
          <button className="modal-close" onClick={handleClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre del Biciestacionamiento <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: Biciestacionamiento Metro Insurgentes"
              className={errors.nombre ? 'input-error' : ''}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
          </div>

          {/* Delegación */}
          <div className="form-group">
            <label htmlFor="delegacion">
              Alcaldía <span className="required">*</span>
            </label>
            <select
              id="delegacion"
              name="delegacion"
              value={formData.delegacion}
              onChange={handleChange}
              className={errors.delegacion ? 'input-error' : ''}
            >
              <option value="">Selecciona una alcaldía</option>
              {DELEGACIONES_CDMX.map(delegacion => (
                <option key={delegacion} value={delegacion}>
                  {delegacion}
                </option>
              ))}
            </select>
            {errors.delegacion && <span className="error-message">{errors.delegacion}</span>}
          </div>

          {/* Colonia y Calle */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="colonia">
                Colonia <span className="required">*</span>
              </label>
              <input
                type="text"
                id="colonia"
                name="colonia"
                value={formData.colonia}
                onChange={handleChange}
                placeholder="Ej: Roma Norte"
                className={errors.colonia ? 'input-error' : ''}
              />
              {errors.colonia && <span className="error-message">{errors.colonia}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="calle">
                Calle <span className="required">*</span>
              </label>
              <input
                type="text"
                id="calle"
                name="calle"
                value={formData.calle}
                onChange={handleChange}
                placeholder="Ej: Av. Insurgentes"
                className={errors.calle ? 'input-error' : ''}
              />
              {errors.calle && <span className="error-message">{errors.calle}</span>}
            </div>
          </div>

          {/* Número */}
          <div className="form-group">
            <label htmlFor="numero">Número</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              placeholder="Ej: 123 o S/N"
            />
          </div>

          {/* Descripción */}
          <div className="form-group">
            <label htmlFor="descripcion">
              Descripción <span className="required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              placeholder="Describe brevemente el biciestacionamiento, características, ubicación exacta, etc."
              rows="4"
              maxLength="300"
              className={errors.descripcion ? 'input-error' : ''}
            />
            <div className="char-counter">
              {formData.descripcion.length}/300 caracteres
            </div>
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
          </div>

          {/* Horario */}
          <div className="form-group">
            <label htmlFor="horario">
              Horario <span className="required">*</span>
            </label>
            <select
              id="horario"
              name="horario"
              value={formData.horario}
              onChange={handleChange}
              className={errors.horario ? 'input-error' : ''}
            >
              <option value="">Selecciona un horario</option>
              {HORARIOS_PREDEFINIDOS.map(horario => (
                <option key={horario} value={horario}>
                  {horario}
                </option>
              ))}
            </select>
            {errors.horario && <span className="error-message">{errors.horario}</span>}
          </div>

          {/* Horario Personalizado */}
          {formData.horario === 'Personalizado' && (
            <div className="form-group">
              <label htmlFor="horarioPersonalizado">
                Especifica el horario <span className="required">*</span>
              </label>
              <input
                type="text"
                id="horarioPersonalizado"
                name="horarioPersonalizado"
                value={formData.horarioPersonalizado}
                onChange={handleChange}
                placeholder="Ej: Lunes a Sábado 8:00 - 18:00"
                className={errors.horarioPersonalizado ? 'input-error' : ''}
              />
              {errors.horarioPersonalizado && (
                <span className="error-message">{errors.horarioPersonalizado}</span>
              )}
            </div>
          )}

          {/* Capacidad y Tipo de Acceso */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="capacidad">Capacidad (bicicletas)</label>
              <input
                type="number"
                id="capacidad"
                name="capacidad"
                value={formData.capacidad}
                onChange={handleChange}
                placeholder="Ej: 20"
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tipoAcceso">Tipo de Acceso</label>
              <select
                id="tipoAcceso"
                name="tipoAcceso"
                value={formData.tipoAcceso}
                onChange={handleChange}
              >
                <option value="publico">Público</option>
                <option value="privado">Privado</option>
                <option value="restringido">Restringido</option>
              </select>
            </div>
          </div>

          {/* Foto */}
          <div className="form-group">
            <label htmlFor="foto">
              Foto del Biciestacionamiento <span className="required">*</span>
            </label>
            <div className="foto-upload">
              <input
                type="file"
                id="foto"
                name="foto"
                accept="image/*"
                onChange={handleFotoChange}
                className="foto-input"
              />
              <label htmlFor="foto" className="foto-label">
                {fotoPreview ? (
                  <div className="foto-preview">
                    <img src={fotoPreview} alt="Preview" />
                    <div className="foto-overlay">
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="17 8 12 3 7 8"></polyline>
                        <line x1="12" y1="3" x2="12" y2="15"></line>
                      </svg>
                      <span>Cambiar foto</span>
                    </div>
                  </div>
                ) : (
                  <div className="foto-placeholder">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21 15 16 10 5 21"></polyline>
                    </svg>
                    <span>Haz clic para subir una foto</span>
                    <small>JPG, PNG (máx. 5MB)</small>
                  </div>
                )}
              </label>
            </div>
            {errors.foto && <span className="error-message">{errors.foto}</span>}
          </div>

          {/* Botones */}
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={handleClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-submit">
              Agregar Biciestacionamiento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLocationModal;