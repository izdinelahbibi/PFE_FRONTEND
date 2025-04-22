import React, { useState, useEffect } from 'react';
import AnnonceService from '../../../services/annonceservice';
import { Modal, Button, Form, Table, Alert } from 'react-bootstrap';

const Annonce = ({ isSidebarOpen }) => {
  const [annonces, setAnnonces] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentAnnonce, setCurrentAnnonce] = useState({ id: null, description: '', role: 'employé' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchAnnonces();
  }, []);

  const fetchAnnonces = async () => {
    try {
      const data = await AnnonceService.getAllAnnonces();
      setAnnonces(data);
    } catch (err) {
      setError('Erreur lors du chargement des annonces');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (currentAnnonce.id) {
        await AnnonceService.updateAnnonce(currentAnnonce.id, currentAnnonce);
        setSuccess('Annonce mise à jour avec succès');
      } else {
        await AnnonceService.createAnnonce(currentAnnonce);
        setSuccess('Annonce créée avec succès');
      }
      setShowModal(false);
      fetchAnnonces();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette annonce ?')) {
      try {
        await AnnonceService.deleteAnnonce(id);
        setSuccess('Annonce supprimée avec succès');
        fetchAnnonces();
        setTimeout(() => setSuccess(''), 3000);
      } catch (err) {
        setError(err.message || 'Erreur lors de la suppression');
        setTimeout(() => setError(''), 3000);
      }
    }
  };

  const openEditModal = (annonce) => {
    setCurrentAnnonce(annonce);
    setShowModal(true);
  };

  const openNewModal = () => {
    setCurrentAnnonce({ id: null, description: '', role: 'employé' });
    setShowModal(true);
  };

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  return (
    <div style={containerStyle}>
      <h2>Gestion des Annonces</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Button variant="primary" onClick={openNewModal} className="mb-3">
        Ajouter une Annonce
      </Button>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Description</th>
            <th>Rôle</th>
            <th>Date de Création</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {annonces.map((annonce) => (
            <tr key={annonce.id}>
              <td>{annonce.description}</td>
              <td>{annonce.role}</td>
              <td>{new Date(annonce.dateCreation).toLocaleString()}</td>
              <td>
                <Button variant="info" size="sm" onClick={() => openEditModal(annonce)}>
                  Modifier
                </Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(annonce.id)}>
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{currentAnnonce.id ? 'Modifier' : 'Créer'} une Annonce</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={currentAnnonce.description}
                onChange={(e) => setCurrentAnnonce({ ...currentAnnonce, description: e.target.value })}
                required
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Attribuer à</Form.Label>
              <Form.Control
                as="select"
                value={currentAnnonce.role}
                onChange={(e) => setCurrentAnnonce({ ...currentAnnonce, role: e.target.value })}
                required
              >
                <option value="employé">Employé</option>
                <option value="validateur">Validateur</option>
              </Form.Control>
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">
              Enregistrer
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Annonce;
