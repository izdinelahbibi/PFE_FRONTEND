import React, { useState, useEffect } from 'react';
import ProjetList from '../../../components/ProjetList';
import AddProjetModal from '../../../components/AddProjetModal';
import { fetchUserInfo, fetchProjetsByDepartement, addProjet, addPlanningAnnuel, fetchDepensesByProjet } from '../../../services/ProjetService';
import { Modal, Button, Table, Spinner, Alert, Form } from 'react-bootstrap';

const Projet = ({ isSidebarOpen }) => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [depenses, setDepenses] = useState([]);

  const [planningData, setPlanningData] = useState({
    annee: new Date().getFullYear(),
    depense: 0,
  });

  const [selectedProjetId, setSelectedProjetId] = useState(null);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [showDepensesModal, setShowDepensesModal] = useState(false);

  const [newProjet, setNewProjet] = useState({
    intitule: '',
    type_investissement: '',
    site: '',
    opportunite: '',
    composantes_projet: '',
    presentation_projet: '',
    cout_estimatif: '',
    planning: 'Annuel', // Valeur par défaut définie explicitement
  });

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) throw new Error('Utilisateur non connecté');

        const userData = await fetchUserInfo(token);
        const departementId = userData.departement_id;

        const projetsData = await fetchProjetsByDepartement(token, departementId);
        // Assure que tous les projets ont un champ 'planning' (valeur par défaut 'Annuel' si manquant)
        const projetsAvecPlanning = projetsData.map(projet => ({
          ...projet,
          planning: projet.planning || 'Annuel',
        }));
        setProjets(projetsAvecPlanning);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProjet(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanningChange = (e) => {
    const { name, value } = e.target;
    setPlanningData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewProjet({
      intitule: '',
      type_investissement: '',
      site: '',
      opportunite: '',
      composantes_projet: '',
      presentation_projet: '',
      cout_estimatif: '',
      planning: 'Annuel', // Réinitialisation explicite
    });
    setPlanningData({
      annee: new Date().getFullYear(),
      depense: 0,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Utilisateur non connecté');
  
      const userData = await fetchUserInfo(token);
      
      // Création du projet avec une valeur 'planning' par défaut
      const projetResponse = await addProjet(token, {
        ...newProjet,
        departement_id: userData.departement_id,
        planning: newProjet.planning || 'Annuel', // Garantit une valeur par défaut
      });
      
      // Ajout du planning si le type est 'Annuel'
      if (newProjet.planning === 'Annuel') {
        try {
          await addPlanningAnnuel(token, {
            annee: planningData.annee,
            depense: planningData.depense,
            projet_id: projetResponse.id,
          });
        } catch (planningError) {
          console.error("Erreur lors de l'ajout du planning:", planningError);
        }
      } 
  
      // Recharge la liste des projets
      const projetsData = await fetchProjetsByDepartement(token, userData.departement_id);
      setProjets(projetsData.map(p => ({ ...p, planning: p.planning || 'Annuel' })));
  
      closeModal();
      setShowSuccessModal(true);
      resetForm();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleOpenPlanningModal = (projetId) => {
    setSelectedProjetId(projetId);
    setShowPlanningModal(true);
  };

  const handleClosePlanningModal = () => {
    setShowPlanningModal(false);
    setPlanningData({
      annee: new Date().getFullYear(),
      depense: 0,
    });
  };

  const handleShowDepenses = async (projetId) => {
    try {
      const token = localStorage.getItem('userToken');
      const depensesData = await fetchDepensesByProjet(token, projetId);
      setDepenses(depensesData);
      setShowDepensesModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCloseDepensesModal = () => {
    setShowDepensesModal(false);
    setDepenses([]);
  };

  const handleAddPlanning = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      await addPlanningAnnuel(token, {
        ...planningData,
        projet_id: selectedProjetId,
      });

      const userData = await fetchUserInfo(token);
      const projetsData = await fetchProjetsByDepartement(token, userData.departement_id);
      setProjets(projetsData.map(p => ({ ...p, planning: p.planning || 'Annuel' })));

      handleClosePlanningModal();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const renderPlanningForm = () => {
    if (newProjet.planning === 'Annuel') {
      return (
        <div className="mt-3 p-3 border rounded">
          <h5>Planning Annuel</h5>
          <Form.Group className="mb-3">
            <Form.Label>Année</Form.Label>
            <Form.Control
              type="number"
              name="annee"
              value={planningData.annee}
              onChange={handlePlanningChange}
              min={new Date().getFullYear()}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Dépense prévue (DT)</Form.Label>
            <Form.Control
              type="number"
              name="depense"
              value={planningData.depense}
              onChange={handlePlanningChange}
              min="0"
              step="0.01"
              required
            />
          </Form.Group>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div style={containerStyle} className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement en cours...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <Alert variant="danger">Erreur: {error}</Alert>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="container-custom">
      <h2 className="text-center mb-4">Projets</h2>

      <ProjetList
        projets={projets}
        openModal={openModal}
        handleOpenPlanningModal={handleOpenPlanningModal}
        handleShowDepenses={handleShowDepenses}
      />

      <AddProjetModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        newProjet={newProjet}
        renderPlanningForm={renderPlanningForm}
      />

      {/* Modals pour feedback et actions supplémentaires */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>✅ Succès</Modal.Title>
        </Modal.Header>
        <Modal.Body>L'opération a été effectuée avec succès.</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowSuccessModal(false)}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showPlanningModal} onHide={handleClosePlanningModal}>
        <Modal.Header closeButton>
          <Modal.Title>Ajouter un planning annuel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleAddPlanning}>
            <Form.Group className="mb-3">
              <Form.Label>Année</Form.Label>
              <Form.Control
                type="number"
                name="annee"
                value={planningData.annee}
                onChange={handlePlanningChange}
                min={new Date().getFullYear()}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Dépense (DT)</Form.Label>
              <Form.Control
                type="number"
                name="depense"
                value={planningData.depense}
                onChange={handlePlanningChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClosePlanningModal}>
                Annuler
              </Button>
              <Button type="submit" variant="primary">
                Enregistrer
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      <Modal show={showDepensesModal} onHide={handleCloseDepensesModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Dépenses du projet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {depenses.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Année</th>
                  <th>Dépense (DT)</th>
                </tr>
              </thead>
              <tbody>
                {depenses.map((depense, index) => (
                  <tr key={index}>
                    <td>{depense.annee}</td>
                    <td>{depense.depense.toLocaleString('fr-FR')} DT</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Aucune dépense trouvée pour ce projet.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDepensesModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Projet;