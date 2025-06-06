import React, { useState, useEffect } from 'react';
import ProjetList from '../../../components/ProjetListE';
import AddProjetModal from '../../../components/AddProjetModal';
import EditProjetModal from '../../../components/EditProjetModal';
import {
  fetchUserInfo,
  fetchProjetsByDepartement,
  addProjet,
  updateProjet,
  addPlanningAnnuel,
  fetchDepensesByProjet,
  fetchRubriquesByDepartement,
  fetchBudgetDetails,
} from '../../../services/ProjetService';
import { Modal, Button, Table, Spinner, Form, Card } from 'react-bootstrap';
import { jsPDF } from 'jspdf';
import './ProjetE.css';

const Projet = ({ isSidebarOpen }) => {
  const [projets, setProjets] = useState([]);
  const [rubriques, setRubriques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentProjet, setCurrentProjet] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showDepensesModal, setShowDepensesModal] = useState(false);
  const [depenses, setDepenses] = useState([]);
  const [showBudgetModal, setShowBudgetModal] = useState(false);
  const [budgetDetails, setBudgetDetails] = useState(null);

  const [planningData, setPlanningData] = useState({
    annee: new Date().getFullYear(),
    depense: 0,
  });

  const [newProjet, setNewProjet] = useState({
    intitule: '',
    rubrique_id: '',
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
        setProjets(projetsData);
      } catch (err) {
        setError(err.message);
        setShowErrorModal(true);
      } finally {
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const openEditModal = (projet) => {
    setCurrentProjet(projet);
    setIsEditModalOpen(true);
  };
  const closeEditModal = () => setIsEditModalOpen(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProjet(prev => ({ ...prev, [name]: value }));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentProjet(prev => ({ ...prev, [name]: value }));
  };

  const handlePlanningChange = (e) => {
    const { name, value } = e.target;
    setPlanningData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setNewProjet({
      intitule: '',
      rubrique_id: '',
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
      if (!newProjet.intitule || !newProjet.rubrique_id || !newProjet.cout_estimatif) {
        setError('Veuillez remplir tous les champs obligatoires (intitulé, rubrique, coût estimatif).');
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
        cout_estimatif: coutEstimatif,
      });

      if (newProjet.planning === 'Annuel' && newDepense > 0) {
        try {
          await addPlanningAnnuel(token, {
            annee: annee,
            depense: newDepense,
            projet_id: projetResponse.id,
          });
        } catch (planningError) {
          console.error("Erreur lors de l'ajout du planning:", planningError);
          setError(planningError.message || 'Erreur lors de l’ajout du planning annuel.');
          setShowErrorModal(true);
          return;
        }
      }

      const projetsData = await fetchProjetsByDepartement(token, userData.departement_id);
      setProjets(projetsData);

      closeModal();
      setShowSuccessModal(true);
      resetForm();
    } catch (err) {
      setError(err.message || 'Une erreur s’est produite lors de l’ajout du projet.');
      setShowErrorModal(true);
    }
  };

  const handleUpdateProjet = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      if (!token) throw new Error('Utilisateur non connecté');

      // Validate currentProjet fields
      if (!currentProjet.intitule || !currentProjet.rubrique_id || !currentProjet.cout_estimatif) {
        setError('Veuillez remplir tous les champs obligatoires (intitulé, rubrique, coût estimatif).');
        setShowErrorModal(true);
        return;
      }

      const coutEstimatif = Number(currentProjet.cout_estimatif);
      if (isNaN(coutEstimatif) || coutEstimatif <= 0) {
        setError('Le coût estimatif doit être un nombre positif.');
        setShowErrorModal(true);
        return;
      }

      await updateProjet(token, currentProjet.id, {
        intitule: currentProjet.intitule,
        rubrique_id: currentProjet.rubrique_id,
        type_investissement: currentProjet.type_investissement,
        site: currentProjet.site,
        opportunite: currentProjet.opportunite,
        composantes_projet: currentProjet.composantes_projet,
        presentation_projet: currentProjet.presentation_projet,
        cout_estimatif: coutEstimatif,
      });

      const userData = await fetchUserInfo(token);
      const projetsData = await fetchProjetsByDepartement(token, userData.departement_id);
      setProjets(projetsData);

      closeEditModal();
      setShowSuccessModal(true);
    } catch (err) {
      setError(err.message || 'Une erreur s’est produite lors de la mise à jour du projet.');
      setShowErrorModal(true);
    }
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

  const handleShowBudget = async (projetId) => {
    try {
      const token = localStorage.getItem('userToken');
      const details = await fetchBudgetDetails(token, projetId);
      const projet = projets.find(p => p.id === projetId);
      setBudgetDetails({ ...details, statut: projet?.statut || 'En cours' });
      setShowBudgetModal(true);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des détails budgétaires.');
      setShowErrorModal(true);
    }
  };

  const handleExportProject = async (projet) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 15;
    let yPosition = margin;

    doc.setFont('times', 'bold');
    doc.setFontSize(16);
    const mainTitle = 'MISE A NIVEAU DES INFRASTRUCTURES DE COMMUNICATION';
    const mainTitleWidth = doc.getTextWidth(mainTitle);
    doc.text(mainTitle, (pageWidth - mainTitleWidth) / 2, yPosition);
    yPosition += 10;

    doc.setFontSize(14);
    const projectTitle = 'FICHE DU PROJET';
    const projectTitleWidth = doc.getTextWidth(projectTitle);
    doc.text(projectTitle, (pageWidth - projectTitleWidth) / 2, yPosition);
    yPosition += 10;

    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 10;

    const detailsHeight = 120; // Increased to accommodate statut
    doc.setFont('times', 'normal');
    doc.setDrawColor(0);
    doc.rect(margin - 5, yPosition - 5, pageWidth - 2 * (margin - 5), detailsHeight);

    doc.setFontSize(12);
    const fields = [
      { label: 'Intitulé :', value: projet.intitule || 'Non spécifié' },
      { label: 'Type d\'investissement :', value: projet.type_investissement || 'Non spécifié' },
      { label: 'Site :', value: projet.site || 'Non spécifié' },
      { label: 'Présentation du projet :', value: projet.presentation_projet || 'Non spécifié' },
      { label: 'Opportunité :', value: projet.opportunite || 'Non spécifié' },
      { label: 'Composantes du projet :', value: projet.composantes_projet || 'Non spécifié' },
      { label: 'Coût estimatif :', value: projet.cout_estimatif ? `${projet.cout_estimatif} mDT` : 'Non spécifié' },
      { label: 'Statut :', value: projet.statut || 'Non spécifié' },
    ];

    fields.forEach(field => {
      doc.setFont('times', 'bold');
      doc.text(field.label, margin, yPosition);
      doc.setFont('times', 'normal');
      const maxWidth = pageWidth - margin - 50;
      const splitText = doc.splitTextToSize(field.value, maxWidth);
      doc.text(splitText, margin + 40, yPosition);
      yPosition += (splitText.length * 5) + 5;
    });

    yPosition += 10;

    doc.setFont('times', 'italic');
    doc.setFontSize(10);
    doc.text(`Août ${new Date().getFullYear()}`, margin, yPosition);

    doc.save(`${projet.intitule}_fiche.pdf`);
  };

  const handleCloseDepensesModal = () => {
    setShowDepensesModal(false);
    setDepenses([]);
    setError(null);
    setShowErrorModal(false);
  };

  const handleCloseBudgetModal = () => {
    setShowBudgetModal(false);
    setBudgetDetails(null);
    setError(null);
    setShowErrorModal(false);
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

      <ProjetList
        projets={projets}
        rubriques={rubriques}
        openModal={openModal}
        openEditModal={openEditModal}
        handleShowDepenses={handleShowDepenses}
        handleShowBudget={handleShowBudget}
        handleExportProject={handleExportProject}
      />

      <AddProjetModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        newProjet={newProjet}
        rubriques={rubriques}
        renderPlanningForm={renderPlanningForm}
      />

      <EditProjetModal
        isModalOpen={isEditModalOpen}
        closeModal={closeEditModal}
        handleSubmit={handleUpdateProjet}
        handleInputChange={handleEditInputChange}
        currentProjet={currentProjet}
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

      <Modal show={showBudgetModal} onHide={handleCloseBudgetModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails budgétaires</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {budgetDetails ? (
            <div className="budget-details">
              <Card className="mb-3">
                <Card.Header>Informations du projet</Card.Header>
                <Card.Body>
                  <Table striped bordered>
                    <tbody>
                      <tr>
                        <td><strong>Statut</strong></td>
                        <td>{budgetDetails.statut || 'Non spécifié'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Card className="mb-3">
                <Card.Header>Budget global</Card.Header>
                <Card.Body>
                  <Table striped bordered>
                    <tbody>
                      <tr>
                        <td><strong>Budget total du projet</strong></td>
                        <td>{budgetDetails.budgetProjet?.toLocaleString('fr-FR')} DT</td>
                      </tr>
                      <tr>
                        <td><strong>Dépenses engagées</strong></td>
                        <td>{budgetDetails.depensesEngagees?.toLocaleString('fr-FR')} DT</td>
                      </tr>
                      <tr>
                        <td><strong>Budget restant</strong></td>
                        <td>
                          {(budgetDetails.budgetProjet - budgetDetails.depensesEngagees)?.toLocaleString('fr-FR')} DT
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
              <Card>
                <Card.Header>Détail par année</Card.Header>
                <Card.Body>
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Année</th>
                        <th>Dépenses prévues (DT)</th>
                        <th>Reste (DT)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {budgetDetails.detailsAnnuels?.map((detail, index) => (
                        <tr key={index}>
                          <td>{detail.annee}</td>
                          <td>{detail.budget?.toLocaleString('fr-FR')} DT</td>
                          <td className={detail.reste < 0 ? 'text-danger' : ''}>
                            {detail.reste?.toLocaleString('fr-FR')} DT
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <Spinner animation="border" />
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseBudgetModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Projet;