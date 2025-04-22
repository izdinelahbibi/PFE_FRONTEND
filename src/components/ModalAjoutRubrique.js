import React, { useState, useEffect } from 'react';
import '../pages/InterfaceAdmin/GestionRubrique/GestionRubrique';

const ModalAjoutRubrique = ({ show, onHide, onSubmit, rubrique }) => {
  const [formData, setFormData] = useState({ 
    nom: '', 
    description: '' 
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (rubrique) {
      setFormData({
        nom: rubrique.nom,
        description: rubrique.description || ''
      });
    } else {
      setFormData({ nom: '', description: '' });
    }
    setErrors({});
  }, [rubrique]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
    }
  };

  if (!show) return null;

  return (
    <div className="rubrique-modal-overlay" onClick={onHide}>
      <div className="rubrique-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{rubrique ? 'Modifier' : 'Nouvelle'} Rubrique</h3>
        
        <form onSubmit={handleSubmit}>
          <div className={`form-group ${errors.nom ? 'has-error' : ''}`}>
            <label>Nom *</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
            />
            {errors.nom && <span className="error-text">{errors.nom}</span>}
          </div>
          
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          
          <div className="modal-actions">
            <button 
              type="button" 
              onClick={onHide}
              className="cancel-button"
            >
              Annuler
            </button>
            <button type="submit" className="save-button">
              Enregistrer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAjoutRubrique;  