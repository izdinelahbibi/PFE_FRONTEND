// GestionDepartement.js
import React, { useState, useEffect } from 'react';
import departementService from '../../services/departementService'; // Importez le service

const GestionDepartement = () => {
  const [nom, setNom] = useState('');
  const [description, setDescription] = useState('');
  const [message, setMessage] = useState('');
  const [departements, setDepartements] = useState([]);

  // Charger la liste des départements au montage du composant
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

      // Recharger la liste des départements après l'ajout
      const updatedDepartements = await departementService.getDepartements();
      setDepartements(updatedDepartements);
    } catch (error) {
      setMessage('Erreur lors de l\'ajout du département.');
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Gestion des Départements</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-3">
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
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description :</label>
          <textarea
            id="description"
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Ajouter</button>
      </form>

      {message && (
        <div className={`alert ${message.includes('Erreur') ? 'alert-danger' : 'alert-success'}`}>
          {message}
        </div>
      )}

      <h3 className="mt-4">Liste des départements</h3>
      <ul className="list-group">
        {departements.map((departement) => (
          <li key={departement.id} className="list-group-item">
            <strong>{departement.nom}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default GestionDepartement;