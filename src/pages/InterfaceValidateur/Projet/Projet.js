import React, { useState, useEffect } from 'react';
import ProjetList from '../../../components/ProjetList';
import AddProjetModal from '../../../components/AddProjetModalV';
import { fetchUserInfo, fetchProjetsByDepartement, addProjet, addPlanningAnnuel, fetchDepensesByProjet, fetchRubriquesByDepartement, updateProjetStatus } from '../../../services/ProjetService';
import { Modal, Button, Table, Spinner, Form, InputGroup, FormControl } from 'react-bootstrap';

const Projet = ({ isSidebarOpen }) => {
  const [projets, setProjets] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [filteredProjets, setFilteredProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [depenses, setDepenses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [planningData, setPlanningData] = useState({
    annee: new Date().getFullYear(),
    depense: 0,
  });
  const [selectedProjetId, setSelectedProjetId] = useState(null);
  const [showPlanningModal, setShowPlanningModal] = useState(false);
  const [showDepensesModal, setShowDepensesModal] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [newProjet, setNewProjet] = useState({
    intitule: '',
    type_investissement: '',
    site: '',
    opportunite: '',
    composantes_projet: '',
    presentation_projet: '',
    cout_estimatif: '',
    planning: 'Annuel',
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
        const rubriquesData = await fetchRubriquesByDepartement(token, departementId);
        setRubriques(rubriquesData);
        const projetsData = await fetchProjetsByDepartement(token, departementId);
        const projetsAvecPlanning = projetsData.map(projet => ({
          ...projet,
          planning: projet.planning || 'Annuel',
          status: projet.statut,
        }));
        setProjets(projetsAvecPlanning);
        setFilteredProjets(projetsAvecPlanning);
      } catch (err) {
        setError(err.message);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProjets(projets);
    } else {
      const filtered = projets.filter(projet =>
        projet.intitule.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProjets(filtered);
    }
  }, [searchTerm, projets]);

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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
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
      planning: 'Annuel',
    });
    setPlanningData({
      annee: new Date().getFullYear(),
      depense: 0,
    });
    setError(null);
    setShowErrorModal(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Utilisateur non connecté');

      // Validate newProjet fields
      if (!newProjet.intitule || !newProjet.cout_estimatif) {
        setError('Veuillez remplir tous les champs obligatoires (intitulé, coût estimatif).');
        setShowErrorModal(true);
        return;
      }

      const coutEstimatif = Number(newProjet.cout_estimatif);
      if (isNaN(coutEstimatif) || coutEstimatif <= 0) {
        setError('Le coût estimatif doit être un nombre positif.');
        setShowErrorModal(true);
        return;
      }

      // Validate planning data if Annuel
      let newDepense = 0;
      let annee = Number(planningData.annee);
      if (newProjet.planning === 'Annuel') {
        newDepense = Number(planningData.depense);
        if (isNaN(newDepense) || newDepense < 0) {
          setError('La dépense prévue doit être un nombre positif ou zéro.');
          setShowErrorModal(true);
          return;
        }
        if (isNaN(annee) || annee < new Date().getFullYear()) {
          setError('L’année doit être valide et ne peut pas être antérieure à l’année actuelle.');
          setShowErrorModal(true);
          return;
        }
        if (newDepense > coutEstimatif) {
          setError('La dépense prévue ne peut pas dépasser le coût estimatif du projet.');
          setShowErrorModal(true);
          return;
        }
      }

      const userData = await fetchUserInfo(token);

      const projetResponse = await addProjet(token, {
        ...newProjet,
        departement_id: userData.departement_id,
        planning: newProjet.planning || 'Annuel',
        cout_estimatif: coutEstimatif,
      });

      if (newProjet.planning === 'Annuel' && newDepense > 0) {
        try {
          await addPlanningAnnuel(token, {
            annee: annee,
            depense: newDepense,
            projet_id: projetResponse.id,
          });

          // Update status if depense equals cout_estimatif
          if (newDepense === coutEstimatif) {
            await updateProjetStatus(token, projetResponse.id, 'Terminé');
          }
        } catch (planningError) {
          console.error("Erreur lors de l'ajout du planning:", planningError);
          setError(planningError.message || 'Erreur lors de l’ajout du planning annuel.');
          setShowErrorModal(true);
          return;
        }
      }

      const projetsData = await fetchProjetsByDepartement(token, userData.departement_id);
      const updatedProjets = projetsData.map(p => ({
        ...p,
        planning: p.planning || 'Annuel',
        status: p.statut,
      }));
      setProjets(updatedProjets);
      setFilteredProjets(updatedProjets);

      closeModal();
      setShowSuccessModal(true);
      resetForm();
    } catch (err) {
      setError(err.message || 'Une erreur s’est produite lors de l’ajout du projet.');
      setShowErrorModal(true);
    }
  };

  const handleOpenPlanningModal = (projetId) => {
    const projet = projets.find(p => p.id === projetId);
    if (projet.status === 'Terminé') {
      setError('Impossible d’ajouter un planning : le projet est déjà terminé.');
      setShowErrorModal(true);
      return;
    }
    setSelectedProjetId(projetId);
    setShowPlanningModal(true);
  };

  const handleClosePlanningModal = () => {
    setShowPlanningModal(false);
    setPlanningData({
      annee: new Date().getFullYear(),
      depense: 0,
    });
    setError(null);
    setShowErrorModal(false);
  };

  const handleShowDepenses = async (projetId) => {
    try {
      const token = localStorage.getItem('userToken');
      const depensesData = await fetchDepensesByProjet(token, projetId);
      setDepenses(depensesData);
      setShowDepensesModal(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des dépenses.');
      setShowErrorModal(true);
    }
  };

  const handleShowDetails = (projetId) => {
    const projet = projets.find(p => p.id === projetId);
    setSelectedProjet(projet);
    setShowDetailsModal(true);
  };

  const handleCloseDepensesModal = () => {
    setShowDepensesModal(false);
    setDepenses([]);
    setError(null);
    setShowErrorModal(false);
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProjet(null);
    setError(null);
    setShowErrorModal(false);
  };

  const handleAddPlanning = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      const newDepense = Number(planningData.depense);
      const annee = Number(planningData.annee);

      // Validate planning data
      if (isNaN(newDepense) || newDepense <= 0) {
        setError('La dépense doit être un nombre positif.');
        setShowErrorModal(true);
        return;
      }
      if (isNaN(annee) || annee < new Date().getFullYear()) {
        setError('L’année doit être valide et ne peut pas être antérieure à l’année actuelle.');
        setShowErrorModal(true);
        return;
      }

      await addPlanningAnnuel(token, {
        annee,
        depense: newDepense,
        projet_id: selectedProjetId,
      });

      const projetsData = await fetchProjetsByDepartement(token, (await fetchUserInfo(token)).departement_id);
      const updatedProjets = projetsData.map(p => ({
        ...p,
        planning: p.planning || 'Annuel',
        status: p.statut,
      }));
      setProjets(updatedProjets);
      setFilteredProjets(updatedProjets);

      handleClosePlanningModal();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de l’ajout du planning.');
      setShowErrorModal(true);
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

  return (
    <div style={containerStyle} className="container-custom">
      <h2 className="text-center mb-4">Projets</h2>

      <div className="mb-4">
        <InputGroup>
          <FormControl
            placeholder="Rechercher par intitulé du projet..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <Button variant="outline-secondary" onClick={() => setSearchTerm('')}>
            Effacer
          </Button>
        </InputGroup>
      </div>

      <ProjetList
        projets={filteredProjets}
        openModal={openModal}
        handleOpenPlanningModal={handleOpenPlanningModal}
        handleShowDepenses={handleShowDepenses}
        handleShowDetails={handleShowDetails}
      />

      <AddProjetModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        newProjet={newProjet}
        renderPlanningForm={renderPlanningForm}
        rubriques={rubriques}
      />

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

      <Modal show={showErrorModal} onHide={() => { setShowErrorModal(false); setError(null); }}>
        <Modal.Header closeButton>
          <Modal.Title>❌ Erreur</Modal.Title>
        </Modal.Header>
        <Modal.Body>{error || 'Une erreur s’est produite.'}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowErrorModal(false); setError(null); }}>
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

      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails du projet: {selectedProjet?.intitule}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProjet && (
            <div>
              <p><strong>Type d'investissement:</strong> {selectedProjet.type_investissement}</p>
              <p><strong>Site:</strong> {selectedProjet.site}</p>
              <p><strong>Opportunité:</strong> {selectedProjet.opportunite}</p>
              <p><strong>Composantes du projet:</strong> {selectedProjet.composantes_projet}</p>
              <p><strong>Présentation du projet:</strong> {selectedProjet.presentation_projet}</p>
              <p><strong>Coût estimatif:</strong> {selectedProjet.cout_estimatif} DT</p>
              <p><strong>Date de création:</strong> {new Date(selectedProjet.date_creation).toLocaleDateString()}</p>
              <p><strong>Type de planning:</strong> {selectedProjet.planning}</p>
              <p><strong>Statut:</strong> {selectedProjet.status}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Projet;