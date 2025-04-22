import React, { useState, useEffect } from 'react';
import departementService from '../../../services/departementService';
import './GestionDepartement.css';

const GestionDepartement = ({ isSidebarOpen }) => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [departements, setDepartements] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editNom, setEditNom] = useState('');
  const [editDescription, setEditDescription] = useState('');

  useEffect(() => {
    const fetchDepartements = async () => {
      try {
        const data = await departementService.getDepartements();
        setDepartements(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des départements :', error);
      }
    };
    fetchDepartements();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await departementService.addDepartement(nom, description);
      setMessage('Département ajouté avec succès !');
      setNom('');
      setDescription('');

      const updatedDepartements = await departementService.getDepartements();
      setDepartements(updatedDepartements);
    } catch (error) {
      setMessage('Erreur lors de l\'ajout du département.');
      console.error('Erreur:', error);
    }
  };

  const handleEdit = (departement) => {
    setEditingId(departement.id);
    setEditNom(departement.nom);
    setEditDescription(departement.description);
  };

  const handleUpdate = async () => {
    try {
      await departementService.updateDepartement(editingId, editNom, editDescription);
      setMessage('Département modifié avec succès !');
      setEditingId(null);

      const updatedDepartements = await departementService.getDepartements();
      setDepartements(updatedDepartements);
    } catch (error) {
      setMessage('Erreur lors de la modification du département.');
      console.error('Erreur:', error);
    }
  };


  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  return (
    
    <div className="gestion-departement-container" style={containerStyle}>
      <h2 className="gestion-departement-title">Gestion des Départements</h2>
      <form onSubmit={handleSubmit} className="gestion-departement-form">
        <div className="form-group">
          <label htmlFor="nom" className="form-label">Nom du département :</label>
          <input
            type="text"
            id="nom"
            className="form-control"
            value={nom}
            onChange={(e) => setNom(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description :</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="add-departement-btn">Ajouter</button>
      </form>

      {message && (
        <div className={`message ${message.includes('Erreur') ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <h3 className="departement-list-title">Liste des départements</h3>
      <ul className="departement-list">
        {departements.map((departement) => (
          <li key={departement.id} className="departement-item">
            {editingId === departement.id ? (
              <div className="edit-form">
                <input
                  type="text"
                  value={editNom}
                  onChange={(e) => setEditNom(e.target.value)}
                  className="form-control"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="form-control"
                />
                <button onClick={handleUpdate} className="save-btn">Enregistrer</button>
                <button onClick={() => setEditingId(null)} className="cancel-btn">Annuler</button>
              </div>
            ) : (
              <>
                <div className="departement-info">
                  <strong>{departement.nom} : </strong>
                  <span>{departement.description}</span>
                </div>
                <div className="departement-actions">
                  <button onClick={() => handleEdit(departement)} className="edit-btn">Modifier</button>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionDepartement;