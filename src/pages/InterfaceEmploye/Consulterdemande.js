import React, { useState, useEffect } from 'react';
import { Table, Spinner, Alert, Container, Button, Modal, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

const ConsulterDemande = () => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false); // État pour gérer l'affichage du modal
  const [selectedDemande, setSelectedDemande] = useState(null); // État pour stocker la demande à modifier

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
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDemandes();
  }, []);

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

      // Mettre à jour l'état local après suppression
      setDemandes(demandes.filter(demande => demande.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (demande) => {
    setSelectedDemande(demande); // Stocker la demande sélectionnée
    setShowModal(true); // Ouvrir le modal
  };

  const handleCloseModal = () => {
    setShowModal(false); // Fermer le modal
    setSelectedDemande(null); // Réinitialiser la demande sélectionnée
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

      // Mettre à jour l'état local après modification
      setDemandes(demandes.map(demande =>
        demande.id === selectedDemande.id ? selectedDemande : demande
      ));

      handleCloseModal(); // Fermer le modal après la modification
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
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" className="custom-spinner">
          <span className="visually-hidden">Chargement en cours...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger" className="text-center custom-alert">
          Erreur: {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="text-center mb-4">Liste des Demandes d'Achats</h2>
      <Table striped bordered hover responsive className="custom-table">
        <thead>
          <tr>
            <th scope="col">Projet</th>
            <th scope="col">Description</th>
            <th scope="col">Quantité</th>
            <th scope="col">Budget</th>
            <th scope="col">Caractéristiques Techniques</th>
            <th scope="col">Statut</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((demande) => (
            <tr key={demande.id}>
              <td>{demande.projet_intitule}</td>
              <td>{demande.description}</td>
              <td>{demande.quantité}</td>
              <td>{demande.budget}</td>
              <td>{demande.caractéristique_tech}</td>
              <td>{demande.statut}</td>
              <td>
                <Button variant="warning" onClick={() => handleEdit(demande)}>Modifier</Button>{' '}
                <Button variant="danger" onClick={() => handleDelete(demande.id)}>Supprimer</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal pour modifier une demande */}
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
              <Form.Group controlId="formQuantité">
                <Form.Label>Quantité</Form.Label>
                <Form.Control
                  type="number"
                  name="quantité"
                  value={selectedDemande.quantité}
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
              <Form.Group controlId="formCaractéristiqueTech">
                <Form.Label>Caractéristiques Techniques</Form.Label>
                <Form.Control
                  type="textarea"
                  name="caractéristique_tech"
                  value={selectedDemande.caractéristique_tech}
                  onChange={handleChange}
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
    </Container>
  );
};

export default ConsulterDemande;