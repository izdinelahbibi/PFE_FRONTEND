import React, { useState, useEffect } from 'react';
import { fetchDepartements } from '../services/departementrService';

const ModalAjoutRubrique = ({ show, onHide, onSubmit, rubrique }) => {
  const [formData, setFormData] = useState({ 
    nom: '', 
    description: '',
    departement_id: ''
  });
  const [departements, setDepartements] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDepartements();
        setDepartements(data);
        
       
        if (rubrique) {
          setFormData({
            nom: rubrique.nom,
            description: rubrique.description || '',
            departement_id: rubrique.departement_id || (data.length > 0 ? data[0].id : '')
          });
        } else {
          setFormData({ 
            nom: '', 
            description: '',
            departement_id: data.length > 0 ? data[0].id : ''
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (show) {
      loadData();
    }
  }, [show, rubrique]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est requis';
    if (!formData.departement_id) newErrors.departement_id = 'Le département est requis';
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
        
        {isLoading ? (
          <div>Chargement...</div>
        ) : (
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

            <div className={`form-group ${errors.departement_id ? 'has-error' : ''}`}>
              <label>Département *</label>
              <select
                name="departement_id"
                value={formData.departement_id}
                onChange={handleChange}
              >
                {departements.map(departement => (
                  <option key={departement.id} value={departement.id}>
                    {departement.nom}
                  </option>
                ))}
              </select>
              {errors.departement_id && <span className="error-text">{errors.departement_id}</span>}
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
        )}
      </div>
    </div>
  );
};

export default ModalAjoutRubrique;