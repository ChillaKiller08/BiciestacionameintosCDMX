// FilterModal.jsx
import React, { useState } from 'react';
import './filtermodal.css';

const FilterModal = ({ isOpen, onClose, onApplyFilters, currentFilters }) => {
  const [filters, setFilters] = useState(currentFilters || {
    tipo: '',
    delegacion: '',
    dias: []
  });

  const tipos = ['Público', 'Privado', 'Restringido'];
  
  const delegaciones = [
    'Álvaro Obregón',
    'Azcapotzalco',
    'Benito Juárez',
    'Coyoacán',
    'Cuajimalpa',
    'Cuauhtémoc',
    'Gustavo A. Madero',
    'Iztacalco',
    'Iztapalapa',
    'Magdalena Contreras',
    'Miguel Hidalgo',
    'Milpa Alta',
    'Tláhuac',
    'Tlalpan',
    'Venustiano Carranza',
    'Xochimilco'
  ];

  const diasSemana = [
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
    'Domingo'
  ];

  const handleTipoChange = (tipo) => {
    setFilters({
      ...filters,
      tipo: filters.tipo === tipo ? '' : tipo
    });
  };

  const handleDiaToggle = (dia) => {
    const newDias = filters.dias.includes(dia)
      ? filters.dias.filter(d => d !== dia)
      : [...filters.dias, dia];
    
    setFilters({
      ...filters,
      dias: newDias
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
    onClose();
  };

  const handleClear = () => {
    const emptyFilters = {
      tipo: '',
      delegacion: '',
      dias: []
    };
    setFilters(emptyFilters);
    onApplyFilters(emptyFilters);
  };

  const hasActiveFilters = filters.tipo || filters.delegacion || filters.dias.length > 0;

  if (!isOpen) return null;

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal" onClick={(e) => e.stopPropagation()}>
        <div className="filter-header">
          <h2>Filtros</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="filter-content">
          <div className="filter-section">
            <h3>Tipo de Acceso</h3>
            <div className="filter-options">
              {tipos.map(tipo => (
                <button
                  key={tipo}
                  className={`filter-chip ${filters.tipo === tipo ? 'active' : ''}`}
                  onClick={() => handleTipoChange(tipo)}
                >
                  {tipo}
                </button>
              ))}
            </div>
          </div>

          <div className="filter-section">
            <h3>Delegación</h3>
            <select
              className="filter-select"
              value={filters.delegacion}
              onChange={(e) => setFilters({ ...filters, delegacion: e.target.value })}
            >
              <option value="">Todas las delegaciones</option>
              {delegaciones.map(delegacion => (
                <option key={delegacion} value={delegacion}>
                  {delegacion}
                </option>
              ))}
            </select>
          </div>

          <div className="filter-section">
            <h3>Días Disponibles</h3>
            <div className="filter-options days-grid">
              {diasSemana.map(dia => (
                <button
                  key={dia}
                  className={`filter-chip day-chip ${filters.dias.includes(dia) ? 'active' : ''}`}
                  onClick={() => handleDiaToggle(dia)}
                >
                  {dia.substring(0, 3)}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="filter-footer">
          <button 
            className="clear-filters-button" 
            onClick={handleClear}
            disabled={!hasActiveFilters}
          >
            Limpiar Filtros
          </button>
          <button className="apply-filters-button" onClick={handleApply}>
            Aplicar Filtros
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;