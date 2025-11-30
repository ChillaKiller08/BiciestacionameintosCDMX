// AddLocationButton.jsx
import React from 'react';
import './addlocationbutton.css';

const AddLocationButton = ({ onClick }) => {
  return (
    <button className="add-location-button" onClick={onClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="12" y1="8" x2="12" y2="16"></line>
        <line x1="8" y1="12" x2="16" y2="12"></line>
      </svg>
      <span>Agregar Ubicación</span>
    </button>
  );
};

export default AddLocationButton;