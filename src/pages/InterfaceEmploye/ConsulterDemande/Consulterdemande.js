import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Button, Modal, Form } from 'react-bootstrap';
import '../ConsulterDemande/ConsulterDemande.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pencil, Trash } from 'react-bootstrap-icons';

const ConsulterDemande = ({ isSidebarOpen }) => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchStatus, setSearchStatus] = useState('');

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

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
        setDemandes(data);
        setFilteredDemandes(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

  // Filter demands based on date and status
  useEffect(() => {
    let filtered = demandes;

    if (searchDate) {
      filtered = filtered.filter((demande) =>
        new Date(demande.date_creation).toISOString().split('T')[0] === searchDate
      );
    }

    if (searchStatus) {
      filtered = filtered.filter((demande) => demande.statut_final === searchStatus);
    }

    setFilteredDemandes(filtered);
  }, [searchDate, searchStatus, demandes]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/demandeachats/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la demande d\'achat');
      }

      setDemandes(demandes.filter((demande) => demande.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (demande) => {
    setSelectedDemande(demande);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDemande(null);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/demandeachats/${selectedDemande.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedDemande),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de la demande d\'achat');
      }

      const updatedDemande = await response.json();
      setDemandes(
        demandes.map((demande) =>
          demande.id === updatedDemande.id ? updatedDemande : demande
        )
      );

      handleCloseModal();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDemande({
      ...selectedDemande,
      [name]: value,
    });
  };

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
      <h2 className="text-center mb-4">Liste des Demandes d'Achats</h2>

      {/* Filter Section */}
      <Form className="mb-4">
        <Form.Group controlId="formSearchDate" className="mb-3">
          <Form.Label>Filtrer par date de création</Form.Label>
          <Form.Control
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formSearchStatus" className="mb-3">
          <Form.Label>Filtrer par statut</Form.Label>
          <Form.Select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Approuvé">Approuvé</option>
            <option value="Rejeté">Rejeté</option>
          </Form.Select>
        </Form.Group>
      </Form>

      <Table striped bordered hover responsive className="custom-table">
        <thead>
          <tr>
            <th>N° Demande</th>
            <th>Projet</th>
            <th>Description</th>
            <th>Quantité</th>
            <th>Budget</th>
            <th>Caractéristiques Techniques</th>
            <th>Motif de Refus</th>
            <th>Statut</th>
            <th>Date de Création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredDemandes.map((demande) => (
            <tr key={demande.id}>
              <td>DA-{demande.id}</td>
              <td>{demande.projet_intitule}</td>
              <td>{demande.description}</td>
              <td>{demande.quantite}</td>
              <td>{demande.budget}</td>
              <td>{demande.caracteristique_tech}</td>
              <td>{demande.validateur2_motif || 'N/A'}</td>
              <td>{demande.statut_final}</td>
              <td>{new Date(demande.date_creation).toLocaleDateString()}</td>
              <td>
                {demande.statut_final === 'Approuvé' || demande.statut_final === 'Rejeté' ? (
                  <span style={{ color: demande.statut_final === 'Approuvé' ? 'green' : 'red' }}>
                    {demande.statut_final === 'Approuvé' ? 'Demande approuvée' : 'Demande rejetée'}
                  </span>
                ) : (
                  <>
                    <Button variant="success" size="sm" onClick={() => handleEdit(demande)}> 
                      <Pencil />
                    </Button>{' '}
                    <Button variant="danger" size="sm" onClick={() => handleDelete(demande.id)}>
                      <Trash />
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal de modification */}
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la demande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDemande && (
            <Form>
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={selectedDemande.description}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formQuantite">
                <Form.Label>Quantité</Form.Label>
                <Form.Control
                  type="number"
                  name="quantite"
                  value={selectedDemande.quantite}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formBudget">
                <Form.Label>Budget</Form.Label>
                <Form.Control
                  type="number"
                  name="budget"
                  value={selectedDemande.budget}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formCaracteristiqueTech">
                <Form.Label>Caractéristiques Techniques</Form.Label>
                <Form.Control
                  as="textarea"
                  name="caracteristique_tech"
                  value={selectedDemande.caracteristique_tech}
                  onChange={handleChange}
                  rows={3}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Enregistrer les modifications
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConsulterDemande;