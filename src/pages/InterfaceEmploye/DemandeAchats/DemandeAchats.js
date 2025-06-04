import React, { useState, useEffect } from 'react';
import {
  fetchUserInfo,
  fetchProjetsByDepartement,
  createDemandeAchats,
} from '../../../services/DemandeService';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const DemandeAchats = ({ isSidebarOpen }) => {
  // État initial du formulaire
  const initialFormState = {
    projet_id: '',
    description: '',
    quantite: '',
    budget: '',
    caracteristique_tech: '',
    fichier: null,
  };

  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [formData, setFormData] = useState(initialFormState);

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

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

  // Gérer les changements dans les champs du formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Gérer le changement de fichier
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ['.pdf', '.doc', '.docx'].includes(file.name.slice(-4).toLowerCase())) {
      setFormData({
        ...formData,
        fichier: file,
      });
    } else {
      alert('Veuillez sélectionner un fichier PDF ou Word.');
    }
  };

  // Soumettre le formulaire
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Vérifier que tous les champs sont remplis
    if (!formData.projet_id || !formData.description || !formData.quantite || !formData.budget || !formData.caracteristique_tech ||  !formData.fichier) {
      alert('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Utilisateur non connecté');

      const data = new FormData();
      data.append('projet_id', formData.projet_id);
      data.append('description', formData.description);
      data.append('quantite', formData.quantite);
      data.append('budget', formData.budget);
      data.append('caracteristique_tech', formData.caracteristique_tech);
      data.append('fichier', formData.fichier);

      await createDemandeAchats(token, data);
      setShowSuccessModal(true);
      setFormData(initialFormState); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={containerStyle} className="container-custom">
      <h2 className="text-center mb-4">Nouvelle Demande d'Achats</h2>

      {error && <Alert variant="danger">{error}</Alert>}
      {loading && <Spinner animation="border" />}

      <Form onSubmit={handleSubmit} encType="multipart/form-data">
        <Form.Group className="mb-3">
          <Form.Label>Projet:</Form.Label>
          <Form.Select name="projet_id" value={formData.projet_id} onChange={handleInputChange} required>
            <option value="">Sélectionnez un projet</option>
            {projets.map((projet) => (
              <option key={projet.id} value={projet.id}>{projet.intitule}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Description:</Form.Label>
          <Form.Control type="text" name="description" value={formData.description} onChange={handleInputChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Quantité:</Form.Label>
          <Form.Control type="number" name="quantite" value={formData.quantité} onChange={handleInputChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Budget:</Form.Label>
          <Form.Control type="number" name="budget" value={formData.budget} onChange={handleInputChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Caracteristique Technique</Form.Label>
          <Form.Control type="text" name="caracteristique_tech" value={formData.caracteristique_tech} onChange={handleInputChange} required />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Importer un fichier:</Form.Label>
          <Form.Control type="file" name="fichier" onChange={handleFileChange} accept=".pdf,.doc,.docx" required />
        </Form.Group>

        <Button variant="primary" type="submit">Soumettre</Button>
      </Form>

      {/* Modal de succès */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Succès</Modal.Title>
        </Modal.Header>
        <Modal.Body>La demande d'achat a été soumise avec succès.</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSuccessModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DemandeAchats;