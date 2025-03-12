import React, { useState, useEffect } from 'react';
import {
  fetchUserInfo,
  fetchProjetsByDepartement,
  createDemandeAchats,
} from '../../services/DemandeService';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const DemandeAchats = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    projet_id: '',
    description: '',
    quantité: '',
    budget: '',
    caractéristique_tech: '',
  });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Récupérer les projets du département de l'utilisateur
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Utilisateur non connecté');
        }

        const userData = await fetchUserInfo(token);
        const departementId = userData.departement_id;

        const projetsData = await fetchProjetsByDepartement(token, departementId);
        setProjets(projetsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.projet_id || !formData.description || !formData.quantité || !formData.budget) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const data = {
        ...formData,
        date_creation: new Date().toISOString(),
      };

      await createDemandeAchats(token, data);
      setShowSuccessModal(true); // Afficher le modal de succès
    } catch (err) {
      setError(err.message);
    }
  };

  const resetForm = () => {
    setFormData({
      projet_id: '',
      description: '',
      quantité: '',
      budget: '',
      caractéristique_tech: '',
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement en cours...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <Alert variant="danger">Erreur: {error}</Alert>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Nouvelle Demande d'Achats</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="projet_id">Projet:</Form.Label>
          <Form.Select
            id="projet_id"
            name="projet_id"
            value={formData.projet_id}
            onChange={handleInputChange}
            required
          >
            <option value="">Sélectionnez un projet</option>
            {projets.map((projet) => (
              <option key={projet.id} value={projet.id}>
                {projet.intitule}
              </option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="description">Description:</Form.Label>
          <Form.Control
            id="description"
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="quantité">Quantité:</Form.Label>
          <Form.Control
            id="quantité"
            type="number"
            name="quantité"
            value={formData.quantité}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="budget">Budget:</Form.Label>
          <Form.Control
            id="budget"
            type="text"
            name="budget"
            value={formData.budget}
            onChange={handleInputChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="caractéristique_tech">Caractéristiques Techniques:</Form.Label>
          <Form.Control
            id="caractéristique_tech"
            as="textarea"
            name="caractéristique_tech"
            value={formData.caractéristique_tech}
            onChange={handleInputChange}
          />
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="primary" type="submit">
            Soumettre
          </Button>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Annuler
          </Button>
        </div>
      </Form>

      {/* Modal de succès */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>✅ Demande d'achats créée avec succès !</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Votre demande d'achats a été enregistrée avec succès.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false); // Fermer le modal
              resetForm(); // Réinitialiser le formulaire
            }}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DemandeAchats;