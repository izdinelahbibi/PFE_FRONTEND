import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import moment from 'moment';
import './Profil.css';

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
    photo: null,
  });

  const [showModal, setShowModal] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      
      setUtilisateur({
        ...data,
        dateNaissance: data.dateNaissance ? moment(data.dateNaissance).format('YYYY-MM-DD') : '',
        photo: data.photo ? `${process.env.REACT_APP_API_URL}/${data.photo}` : null
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Vérification de la taille du fichier (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        setMessage('La taille du fichier ne doit pas dépasser 2MB');
        return;
      }
      
      // Vérification du type de fichier
      if (!file.type.match('image.*')) {
        setMessage('Veuillez sélectionner un fichier image valide');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadPhoto = async () => {
    if (!selectedFile) {
      setMessage('Veuillez sélectionner un fichier');
      return;
    }

    setUploading(true);
    setMessage('');
    try {
      const token = localStorage.getItem('userToken');
      const formData = new FormData();
      formData.append('photo', selectedFile);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/utilisateur/photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const result = await response.json();
      setUtilisateur({ ...utilisateur, photo: `${process.env.REACT_APP_API_URL}/${result.photo}` });
      setMessage('Photo de profil mise à jour avec succès!');
      setShowPhotoModal(false);
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage(error.message || 'Erreur lors du téléchargement de la photo');
    } finally {
      setUploading(false);
    }
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
      {message && <Alert variant={message.includes('succès') ? 'success' : 'danger'} onClose={() => setMessage('')} dismissible>{message}</Alert>}
      
      <div className="profile-header">
        <h2>Profil de l'utilisateur</h2>
      </div>

      {loading ? (
        <div className="text-center">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-photo-section">
            {utilisateur.photo ? (
              <Image 
                src={utilisateur.photo} 
                roundedCircle 
                className="profile-photo"
                onClick={() => setShowPhotoModal(true)}
                alt="Photo de profil"
              />
            ) : (
              <div 
                className="profile-photo-placeholder"
                onClick={() => setShowPhotoModal(true)}
              >
                {utilisateur.prenom?.charAt(0)}{utilisateur.nom?.charAt(0)}
              </div>
            )}
            <Button 
              variant="outline-secondary" 
              size="sm" 
              onClick={() => setShowPhotoModal(true)}
              className="mt-2"
            >
              Changer photo
            </Button>
          </div>

          <div className="profile-info">
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
          </div>

          <Button className="profile-button" onClick={() => setShowModal(true)}>
            Modifier le profil
          </Button>
        </div>
      )}

      {/* Modal pour modifier la photo */}
      <Modal show={showPhotoModal} onHide={() => {
        setShowPhotoModal(false);
        setSelectedFile(null);
        setPreview(null);
      }}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la photo de profil</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="formPhoto">
            <Form.Label>Choisir une image (max 2MB)</Form.Label>
            <Form.Control 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange}
              disabled={uploading}
            />
            <Form.Text className="text-muted">
              Formats acceptés: JPG, PNG, GIF
            </Form.Text>
          </Form.Group>
          {preview && (
            <div className="mt-3 text-center">
              <Image src={preview} thumbnail style={{ maxWidth: '200px' }} alt="Aperçu" />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => {
              setShowPhotoModal(false);
              setSelectedFile(null);
              setPreview(null);
            }}
            disabled={uploading}
          >
            Annuler
          </Button>
          <Button 
            variant="primary" 
            onClick={handleUploadPhoto}
            disabled={!selectedFile || uploading}
          >
            {uploading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Envoi en cours...</span>
              </>
            ) : 'Enregistrer'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal pour modifier les informations du profil */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Modifier le profil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Form.Group controlId="formNom" className="mb-3">
              <Form.Label>Nom</Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={utilisateur.nom}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formPrenom" className="mb-3">
              <Form.Label>Prénom</Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={utilisateur.prenom}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formAdresse" className="mb-3">
              <Form.Label>Adresse</Form.Label>
              <Form.Control
                type="text"
                name="adresse"
                value={utilisateur.adresse}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formDateNaissance" className="mb-3">
              <Form.Label>Date de naissance</Form.Label>
              <Form.Control
                type="date"
                name="dateNaissance"
                value={utilisateur.dateNaissance}
                onChange={handleInputChange}
              />
            </Form.Group>
            <Form.Group controlId="formTelephone" className="mb-3">
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