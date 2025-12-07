// ImageUploader.jsx
import React, { useState } from 'react';
import './ImageUploader.css';

const ImageUploader = ({ onImageUploaded, currentImage }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImage || null);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    
    if (!file) return;

    // Validar tamaño (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen no debe pesar más de 5MB');
      return;
    }

    // Validar tipo
    if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
      alert('Solo se permiten imágenes JPG, JPEG o PNG');
      return;
    }

    try {
      setUploading(true);

      // Crear FormData
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.REACT_APP_CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'biciestacionamientos');

      // Subir a Cloudinary
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: 'POST',
          body: formData
        }
      );

      const data = await response.json();

      if (data.secure_url) {
        setPreview(data.secure_url);
        onImageUploaded(data.secure_url);
      } else {
        alert('Error al subir la imagen');
      }

    } catch (error) {
      console.error('Error:', error);
      alert('Error al subir la imagen');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="image-uploader">
      <label htmlFor="image-upload" className="upload-label">
        {preview ? (
          <div className="image-preview">
            <img src={preview} alt="Preview" />
            <div className="change-image-overlay">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="17 8 12 3 7 8"></polyline>
                <line x1="12" y1="3" x2="12" y2="15"></line>
              </svg>
              <span>Cambiar imagen</span>
            </div>
          </div>
        ) : (
          <div className="upload-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
            <p>{uploading ? 'Subiendo imagen...' : 'Click para subir imagen'}</p>
            <span>JPG, PNG (máx. 5MB)</span>
          </div>
        )}
      </label>
      
      <input
        id="image-upload"
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleImageUpload}
        disabled={uploading}
        style={{ display: 'none' }}
      />
    </div>
  );
};

export default ImageUploader;