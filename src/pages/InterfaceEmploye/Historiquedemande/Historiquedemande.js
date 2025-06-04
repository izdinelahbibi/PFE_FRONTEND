import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const Historiquedemande = ({ isSidebarOpen }) => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchDate, setSearchDate] = useState('');

  // Dynamic styles for sidebar adjustment
  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  // Fetch all purchase demands
  useEffect(() => {
    const fetchDemandes = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Utilisateur non connecté');
        }

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/demandeachats`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des demandes d\'achats');
        }

        const data = await response.json();
        // Filter only approved and rejected demands
        const filteredData = data.filter(
          (demande) => demande.statut_final === 'Approuvé' || demande.statut_final === 'Rejeté'
        );
        setDemandes(filteredData);
        setFilteredDemandes(filteredData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  // Filter demands based on date
  useEffect(() => {
    let filtered = demandes;

    if (searchDate) {
      filtered = filtered.filter((demande) =>
        new Date(demande.date_creation).toISOString().split('T')[0] === searchDate
      );
    }

    setFilteredDemandes(filtered);
  }, [searchDate, demandes]);

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
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="bg-gray-50">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Historique des Demandes d'Achats</h2>
      </div>

      {/* Date Filter */}
      <Form className="mb-4 max-w-md">
        <Form.Group controlId="formSearchDate" className="mb-3">
          <Form.Label className="text-gray-700 font-medium">Filtrer par date de création</Form.Label>
          <Form.Control
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
            className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          />
        </Form.Group>
      </Form>

      {filteredDemandes.length === 0 ? (
        <Alert variant="info" className="text-center">
          Aucune demande approuvée ou rejetée trouvée pour la date sélectionnée.
        </Alert>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="custom-table bg-white shadow-sm rounded">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th>N° Demande</th>
                <th>Date</th>
                <th>Projet</th>
                <th>Description</th>
                <th>Quantité</th>
                <th>Budget</th>
                <th>Caractéristiques Techniques</th>
                <th>Statut</th>
                <th>Motif de Refus</th>
              </tr>
            </thead>
            <tbody>
              {filteredDemandes.map((demande) => (
                <tr key={demande.id}>
                  <td>DA-{demande.id}</td>
                  <td>{new Date(demande.date_creation).toLocaleDateString()}</td>
                  <td>{demande.projet_intitule}</td>
                  <td>{demande.description}</td>
                  <td className="text-center">{demande.quantite}</td>
                  <td className="text-end">{demande.budget.toLocaleString()} DT</td>
                  <td>{demande.caracteristique_tech || 'N/A'}</td>
                  <td
                    className={
                      demande.statut_final === 'Rejeté' ? 'text-red-600' : 'text-green-600'
                    }
                  >
                    {demande.statut_final}
                  </td>
                  <td className="text-red-600">{demande.validateur2_motif || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default Historiquedemande;