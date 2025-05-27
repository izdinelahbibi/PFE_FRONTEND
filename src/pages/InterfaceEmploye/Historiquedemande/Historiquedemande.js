import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Historiquedemande = ({ isSidebarOpen }) => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Styles dynamiques pour la marge gauche
  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  useEffect(() => {
    const fetchRejectedDemandes = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Utilisateur non connecté');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/demandeachats/rejetees`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des demandes rejetées');
        }

        const data = await response.json();
        setDemandes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchRejectedDemandes();
  }, []);

  if (loading) {
    return (
      <div style={containerStyle} className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" className="custom-spinner">
          <span className="visually-hidden">Chargement en cours...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <Alert variant="danger" className="text-center custom-alert">
          Erreur: {error}
        </Alert>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 className="text-center mb-4">Historique des Demandes Rejetées</h2>
      {demandes.length === 0 ? (
        <Alert variant="info" className="text-center">
          Aucune demande rejetée trouvée.
        </Alert>
      ) : (
        <Table striped bordered hover responsive className="custom-table">
          <thead>
            <tr>
              <th scope="col">Projet</th>
              <th scope="col">Description</th>
              <th scope="col">Quantité</th>
              <th scope="col">Budget</th>
              <th scope="col">Caractéristiques Techniques</th>
              <th scope="col">Motif de Refus</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande) => (
              <tr key={demande.id}>
                <td>{demande.projet_intitule}</td>
                <td>{demande.description}</td>
                <td>{demande.quantite}</td>
                <td>{demande.budget}</td>
                <td>{demande.caracteristique_tech}</td>
                <td className="text-danger fw-bold">{demande.validateur2_motif || 'Non spécifié'}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Historiquedemande;