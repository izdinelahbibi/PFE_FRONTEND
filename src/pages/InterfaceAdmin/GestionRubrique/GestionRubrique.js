// pages/GestionRubriqueAvecDepartement.js
import React, { useState, useEffect } from 'react';
import {
  fetchRubriques,
  createRubrique,
  updateRubrique,
} from '../../../services/rubriqueService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ModalAjoutRubrique from '../../../components/ModalAjoutRubrique';
import './GestionRubrique.css';

const GestionRubrique = ({ isSidebarOpen }) => {
  const [rubriques, setRubriques] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentRubrique, setCurrentRubrique] = useState(null);

  // Les fonctions existantes restent inchangées
  useEffect(() => {
    loadRubriques();
  }, []);

  const loadRubriques = async () => {
    try {
      setIsLoading(true);
      const data = await fetchRubriques();
      setRubriques(data);
    } catch (error) {
      toast.error('Erreur lors du chargement des rubriques');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setCurrentRubrique(null);
    setShowModal(true);
  };

  const handleEdit = (rubrique) => {
    setCurrentRubrique(rubrique);
    setShowModal(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (currentRubrique) {
        await updateRubrique(currentRubrique.id, formData);
        toast.success('Rubrique mise à jour avec succès');
      } else {
        await createRubrique(formData);
        toast.success('Rubrique créée avec succès');
      }
      setShowModal(false);
      loadRubriques();
    } catch (error) {
      toast.error(error.message || 'Une erreur est survenue');
      console.error(error);
    }
  };

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  return (
    <div style={containerStyle}>
      <div className="rubrique-header">
        <h2>Gestion des Rubriques</h2>
        <button onClick={handleAdd} className="rubrique-add-button">
          + Ajouter Rubrique
        </button>
      </div>

      {isLoading ? (
        <div className="loading">Chargement...</div>
      ) : (
        <div className="table-container">
          <table className="rubrique-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Description</th>
                <th>Département</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rubriques.length > 0 ? (
                rubriques.map((rubrique) => (
                  <tr key={rubrique.id}>
                    <td>{rubrique.nom}</td>
                    <td>{rubrique.description || '-'}</td>
                    <td>{rubrique.departement?.nom || 'Non attribué'}</td>
                    <td>{new Date(rubrique.date_creation).toLocaleDateString()}</td>
                    <td>
                      <button
                        onClick={() => handleEdit(rubrique)}
                        className="edit-button"
                      >
                        Modifier
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">
                    Aucune rubrique trouvée
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <ModalAjoutRubrique
        show={showModal}
        onHide={() => setShowModal(false)}
        onSubmit={handleSubmit}
        rubrique={currentRubrique}
      />
    </div>
  );
};

export default GestionRubrique;