import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import moment from 'moment';
import './Profil.css'; // Assurez-vous d'importer votre fichier CSS

const Profil = () => {
  const [utilisateur, setUtilisateur] = useState({
    id: '',
    nom: '',
    prenom: '',
    cin: '',
    matricule: '',
    email: '',
    role: '',
    adresse: '',
    dateNaissance: '',
    Telephone: '',
    departement_nom: '',

  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Récupérer les données de l'utilisateur
  useEffect(() => {
    fetchUtilisateurData();
  }, []);

  const fetchUtilisateurData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMessage('Vous devez être connecté pour accéder à cette page.');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/utilisateur/profil`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des données');
      }

      const data = await response.json();
      if (!data || !data.nom) {
        throw new Error('Données utilisateur invalides');
      }

      setUtilisateur({
        id: data.id || '',
        nom: data.nom || '',
        prenom: data.prenom || '',
        cin: data.cin || '',
        matricule: data.matricule || '',
        email: data.email || '',
        role: data.role || '',
        adresse: data.adresse || '',
        dateNaissance: data.dateNaissance ? moment(data.dateNaissance).format('YYYY-MM-DD') : '',
        Telephone: data.Telephone || '',
        departement_nom: data.departement_nom || '',
      
      });
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la récupération des données du profil.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUtilisateur({ ...utilisateur, [name]: value });
  };

  const handleSave = async () => {
    if (!utilisateur.nom || !utilisateur.prenom || !utilisateur.adresse || !utilisateur.dateNaissance || !utilisateur.Telephone) {
      setMessage('Veuillez remplir tous les champs obligatoires.');
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMessage('Vous devez être connecté pour modifier votre profil.');
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/utilisateur/profil`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          adresse: utilisateur.adresse,
          dateNaissance: utilisateur.dateNaissance,
          Telephone: utilisateur.Telephone,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la mise à jour du profil');
      }

      setMessage('Profil mis à jour avec succès !');
      setShowModal(false);
      fetchUtilisateurData();
    } catch (error) {
      console.error('Erreur:', error);
      setMessage('Erreur lors de la mise à jour du profil.');
    }
  };

  return (
    <div className="profile-container">
      {message && <Alert variant={message.includes('succès') ? 'success' : 'danger'}>{message}</Alert>}
      <div className="profile-header">
        <h2>Profil Validateur</h2>
      </div>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      ) : (
        <div className="profile-card">
          <p><strong>Nom:</strong> {utilisateur.nom}</p>
          <p><strong>Prénom:</strong> {utilisateur.prenom}</p>
          <p><strong>CIN:</strong> {utilisateur.cin}</p>
          <p><strong>Matricule:</strong> {utilisateur.matricule}</p>
          <p><strong>Email:</strong> {utilisateur.email}</p>
          <p><strong>Rôle:</strong> {utilisateur.role}</p>
          <p><strong>Département:</strong> {utilisateur.departement_nom}</p>
          <p><strong>Adresse:</strong> {utilisateur.adresse}</p>
          <p><strong>Date de naissance:</strong> {utilisateur.dateNaissance}</p>
          <p><strong>Téléphone:</strong> {utilisateur.Telephone}</p>
          <Button className="profile-button" onClick={() => setShowModal(true)}>
            Modifier
          </Button>
        </div>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Modifier le profil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Form.Group controlId="formNom">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={utilisateur.nom}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrenom">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={utilisateur.prenom}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAdresse">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="adresse"
                value={utilisateur.adresse}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDateNaissance">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                name="dateNaissance"
                value={utilisateur.dateNaissance}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTelephone">
              <Form.Label>Téléphone</Form.Label>
              <Form.Control
                type="text"
                name="Telephone"
                value={utilisateur.Telephone}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Sauvegarder
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profil;