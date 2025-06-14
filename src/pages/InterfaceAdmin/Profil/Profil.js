import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner, Image } from 'react-bootstrap';
import './Profil.css';

const Profil = () => {
  const [administrateur, setAdministrateur] = useState({
    id: '',
    nom: '',
    prenom: '',
    cin: '',
    email: '',
    role: '',
    Telephone: '',
    photo: '',
  });

  const [showModal, setShowModal] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);
    setMessage({ text: '', type: '' });
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMessage({ text: 'Vous devez être connecté pour accéder à cette page.', type: 'danger' });
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/administrateur/profil`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la récupération des données');
      }

      setAdministrateur({
        id: data.id || '',
        nom: data.nom || '',
        prenom: data.prenom || '',
        cin: data.cin || '',
        email: data.email || '',
        role: data.role || '',
        Telephone: data.Telephone || '',
        photo: data.photo ? `${process.env.REACT_APP_API_URL}${data.photo}` : '',
      });
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: error.message || 'Erreur lors de la récupération des données du profil.', type: 'danger' });
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!administrateur.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!administrateur.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    if (!administrateur.Telephone.trim()) newErrors.Telephone = 'Le téléphone est obligatoire';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setAdministrateur(prev => ({
      ...prev,
      [name]: value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setMessage({ text: 'La taille du fichier ne doit pas dépasser 2MB', type: 'danger' });
        return;
      }

      if (!file.type.match('image.*')) {
        setMessage({ text: 'Veuillez sélectionner un fichier image valide', type: 'danger' });
        return;
      }

      setSelectedFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadPhoto = async () => {
    if (!selectedFile) return;

    setUploadingPhoto(true);
    try {
      const token = localStorage.getItem('userToken');
      const formData = new FormData();
      formData.append('photo', selectedFile);

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/administrateur/photo`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors du téléchargement de la photo');
      }

      setAdministrateur(prev => ({
        ...prev,
        photo: `${process.env.REACT_APP_API_URL}/${data.photo}`
      }));

      setMessage({ text: 'Photo de profil mise à jour avec succès!', type: 'success' });
      setSelectedFile(null);
      setPhotoPreview(null);
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: error.message || 'Erreur lors du téléchargement de la photo', type: 'danger' });
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        setMessage({ text: 'Vous devez être connecté pour modifier votre profil.', type: 'danger' });
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/administrateur/profil`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nom: administrateur.nom,
          prenom: administrateur.prenom,
          Telephone: administrateur.Telephone,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Erreur lors de la mise à jour du profil');
      }

      if (selectedFile) {
        await uploadPhoto();
      }

      setMessage({ text: 'Profil mis à jour avec succès !', type: 'success' });
      setShowModal(false);
      fetchAdminData();
    } catch (error) {
      console.error('Erreur:', error);
      setMessage({ text: error.message || 'Erreur lors de la mise à jour du profil.', type: 'danger' });
    }
  };

  return (
    <div className="profile-container">
      {message.text && (
        <Alert variant={message.type} onClose={() => setMessage({ text: '', type: '' })} dismissible>
          {message.text}
        </Alert>
      )}

      <div className="profile-header">
        <h2>Profil Administrateur</h2>
      </div>

      {loading ? (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Chargement...</span>
          </Spinner>
          <p>Chargement du profil...</p>
        </div>
      ) : (
        <div className="profile-card">
          <div className="profile-photo-section">
            {administrateur.photo ? (
              <Image
                src={administrateur.photo}
                roundedCircle
                className="profile-photo"
                alt="Photo de profil"
              />
            ) : (
              <div className="profile-photo-placeholder">
                {administrateur.prenom?.charAt(0)}{administrateur.nom?.charAt(0)}
              </div>
            )}
          </div>

          <div className="profile-info">
            <p><strong>Nom:</strong> {administrateur.nom}</p>
            <p><strong>Prénom:</strong> {administrateur.prenom}</p>
            <p><strong>CIN:</strong> {administrateur.cin}</p>
            <p><strong>Email:</strong> {administrateur.email}</p>
            <p><strong>Rôle:</strong> {administrateur.role}</p>
            <p><strong>Téléphone:</strong> {administrateur.Telephone}</p>
          </div>

          <div className="profile-actions">
            <Button
              variant="primary"
              onClick={() => setShowModal(true)}
              className="profile-button"
            >
              Modifier le profil
            </Button>
          </div>
        </div>
      )}

      <Modal show={showModal} onHide={() => {
        setShowModal(false);
        setSelectedFile(null);
        setPhotoPreview(null);
      }} centered>
        <Modal.Header closeButton className="modal-header">
          <Modal.Title>Modifier le profil</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <Form>
            <Form.Group controlId="formNom" className="mb-3">
              <Form.Label>Nom <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="nom"
                value={administrateur.nom}
                onChange={handleInputChange}
                isInvalid={!!errors.nom}
              />
              <Form.Control.Feedback type="invalid">
                {errors.nom}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPrenom" className="mb-3">
              <Form.Label>Prénom <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="prenom"
                value={administrateur.prenom}
                onChange={handleInputChange}
                isInvalid={!!errors.prenom}
              />
              <Form.Control.Feedback type="invalid">
                {errors.prenom}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formTelephone" className="mb-3">
              <Form.Label>Téléphone <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="Telephone"
                value={administrateur.Telephone}
                onChange={handleInputChange}
                isInvalid={!!errors.Telephone}
              />
              <Form.Control.Feedback type="invalid">
                {errors.Telephone}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group controlId="formPhoto" className="mb-3">
              <Form.Label>Photo de profil</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                disabled={uploadingPhoto}
              />
              <Form.Text className="text-muted">
                Formats acceptés: JPG, PNG, GIF (max 2MB)
              </Form.Text>
            </Form.Group>

            {(photoPreview || administrateur.photo) && (
              <div className="text-center mt-3">
                <Image
                  src={photoPreview || administrateur.photo}
                  thumbnail
                  style={{ maxWidth: '200px' }}
                  alt="Aperçu photo de profil"
                />
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button
            variant="secondary"
            onClick={() => {
              setShowModal(false);
              setSelectedFile(null);
              setPhotoPreview(null);
            }}
            disabled={uploadingPhoto}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            disabled={uploadingPhoto}
          >
            {uploadingPhoto ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                <span className="ms-2">Enregistrement...</span>
              </>
            ) : 'Sauvegarder'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profil;