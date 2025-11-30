// FilterButton.jsx
import React from 'react';
import './filterbutton.css';

const FilterButton = ({ onClick }) => {
  return (
    <button className="filter-button" onClick={onClick}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
      </svg>
      <span>Filtro</span>
    </button>
  );
};

export default FilterButton;