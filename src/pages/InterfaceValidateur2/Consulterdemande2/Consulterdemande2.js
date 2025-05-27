import React, { useState, useEffect } from 'react';
import {
  Card, Badge, Button, Modal, Form, Tab, Tabs,
  Table
} from 'react-bootstrap';
import {
  FaDownload, FaEye, FaCheck, FaTimes, FaInfoCircle,
  FaClock, FaHistory
} from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getDemandesPourValidateur2,
  submitValidation2,
  downloadFile as downloadFileService,
  getHistoriqueValidations
} from '../../../services/demandeAchatService2';

import './consulter.css'; 


const Consulterdemande2 = ({ isSidebarOpen }) => {
  const [demandes, setDemandes] = useState([]);
  const [historique, setHistorique] = useState([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState(null);
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [currentDemande, setCurrentDemande] = useState(null);
  const [decision, setDecision] = useState('');
  const [motif, setMotif] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [activeTab, setActiveTab] = useState('pending');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const demandesData = await getDemandesPourValidateur2();
      
      // Filtrer les demandes qui n'ont pas encore de décision de validateur2
      const pending = demandesData.filter(d => 
        d.statut === 'En validation 2' && 
        !d.validateur2_decision
      );
      
      const historiqueData = await getHistoriqueValidations();
      
      setDemandes(pending);
      setHistorique(historiqueData);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des données');
      setLoading(false);
      toast.error(err.message || 'Erreur lors de la récupération des données');
    }
  };

  
  const handleDecision = (demande) => {
    setCurrentDemande(demande);
    setDecision('');
    setMotif('');
    setShowDecisionModal(true);
  };

  const handleSubmitDecision = async () => {
    if (!decision) {
      toast.error('Veuillez sélectionner une décision');
      return;
    }

    try {
      await submitValidation2(currentDemande.id, decision, decision === 'Rejeté' ? motif : '');
      toast.success(`Demande ${decision === 'Approuvé' ? 'approuvée' : 'rejetée'} avec succès`);
      setShowDecisionModal(false);
      fetchData();
    } catch (err) {
      toast.error(err.message || "Erreur lors de l'enregistrement de la décision");
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'Approuvé':
        return <Badge bg="success">{statut}</Badge>;
      case 'Rejeté':
        return <Badge bg="danger">{statut}</Badge>;
      case 'En validation 2':
        return <Badge bg="warning" text="dark">{statut}</Badge>;
      case 'Terminé':
        return <Badge bg="info">{statut}</Badge>;
      default:
        return <Badge bg="secondary">{statut}</Badge>;
    }
  };

  const handleShowDetails = (demande) => {
    setSelectedDemande(demande);
    setShowDetailsModal(true);
  };

  const downloadFile = async (filePath) => {
    try {
      await downloadFileService(filePath);
    } catch (err) {
      toast.error(err.message || "Erreur lors du téléchargement du fichier");
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Haute':
        return 'danger';
      case 'Moyenne':
        return 'warning';
      case 'Basse':
        return 'success';
      default:
        return 'secondary';
    }
  };

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  // Get pending and processed demandes
  const pendingDemandes = demandes.filter(d => !d.validateur2_decision);
  const processedDemandes = [...historique, ...demandes.filter(d => d.validateur2_decision)];

  return (
    <div style={containerStyle} className="validator-container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <span className="text-primary">Validation Niveau 2</span> - Tableau de bord
        </h2>
      </div>

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-3 custom-tabs"
      >
        <Tab eventKey="pending" title={<><FaClock className="me-1" /> En Attente</>}>
          {renderPendingDemandes()}
        </Tab>
        <Tab eventKey="processed" title={<><FaHistory className="me-1" /> Historique</>}>
          {renderProcessedDemandes()}
        </Tab>
      </Tabs>

      {renderDecisionModal()}
      {renderDetailsModal()}
    </div>
  );

  function renderPendingDemandes() {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement en cours...</span>
          </div>
          <p className="mt-2">Chargement des demandes...</p>
        </div>
      );
    }

    if (pendingDemandes.length === 0) {
      return (
        <div className="text-center py-5">
         
          <h5>Aucune demande en attente</h5>
          <p className="text-muted">Toutes les demandes ont été traitées</p>
        </div>
      );
    }

    return (
      <div className="row">
        {pendingDemandes.map((demande) => (
          <div key={demande.id} className="col-md-6 col-lg-4 mb-4">
            <Card className="h-100 demande-card">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span className="fw-bold">#{demande.id}</span>
                <Badge bg={getPriorityColor(demande.priorite)}>
                  {demande.priorite || 'Non spécifiée'}
                </Badge>
              </Card.Header>
              <Card.Body>
                <h5 className="card-title">{demande.projet_nom}</h5>
                <p className="card-text text-muted">{demande.description?.substring(0, 100)}...</p>

                <div className="d-flex justify-content-between mb-2">
                  <span>Budget:</span>
                  <span className="fw-bold">{demande.budget} DT</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span>Quantité:</span>
                  <span className="fw-bold">{demande.quantite}</span>
                </div>

                <div className="validation-progress mb-3">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>Validation 1:</span>
                    {demande.validateur1_decision === 'Approuvé' ? (
                      <Badge bg="success"><FaCheck /></Badge>
                    ) : (
                      <Badge bg="danger"><FaTimes /></Badge>
                    )}
                  </div>
                  <div className="d-flex justify-content-between small">
                    <span>Validation 2:</span>
                    <Badge bg="secondary">En attente</Badge>
                  </div>
                </div>
              </Card.Body>
              <Card.Footer className="bg-transparent border-top-0">
                <div className="d-flex justify-content-between">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() => handleShowDetails(demande)}
                  >
                    <FaEye className="me-1" /> Détails
                  </Button>
                  {demande.fichier_chemin && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => downloadFile(demande.fichier_chemin)}
                    >
                      <FaDownload className="me-1" /> Fichier
                    </Button>
                  )}
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleDecision(demande)}
                  >
                    <FaCheck className="me-1" /> Valider
                  </Button>
                </div>
              </Card.Footer>
            </Card>
          </div>
        ))}
      </div>
    );
  }

  function renderProcessedDemandes() {
    if (loading) {
      return (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement en cours...</span>
          </div>
          <p className="mt-2">Chargement de l'historique...</p>
        </div>
      );
    }

    return (
      <div className="table-responsive">
        <Table hover className="align-middle">
          <thead className="table-light">
            <tr>
              <th>Projet</th>
              <th>Description</th>
              <th>Budget</th>
              <th>Décision</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {processedDemandes.length > 0 ? (
              processedDemandes.map((demande) => (
                <tr key={demande.id}>
                  <td>{demande.projet_nom}</td>
                  <td className="text-truncate" style={{ maxWidth: '200px' }} title={demande.description}>
                    {demande.description}
                  </td>
                  <td>{demande.budget} DT</td>
                  <td>
                    {demande.validateur2_decision === 'Approuvé' ? (
                      <Badge bg="success"><FaCheck /> Approuvé</Badge>
                    ) : (
                      <Badge bg="danger"><FaTimes /> Rejeté</Badge>
                    )}
                  </td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowDetails(demande)}
                      title="Voir détails"
                    >
                      <FaEye />
                    </Button>
                    {demande.fichier_chemin && (
                      <Button
                        variant="outline-secondary"
                        size="sm"
                        onClick={() => downloadFile(demande.fichier_chemin)}
                        title="Télécharger fichier"
                      >
                        <FaDownload />
                      </Button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center py-5">
                  <img
                    src="/images/empty-state.svg"
                    alt="Aucune demande"
                    style={{ width: '150px', opacity: 0.7 }}
                    className="mb-3"
                  />
                  <h5>Aucune demande traitée</h5>
                  <p className="text-muted">Vous n'avez pas encore traité de demandes</p>
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </div>
    );
  }

  function renderDecisionModal() {
    const preDefinedReasons = [
      "Budget trop élevé pour le projet",
      "Description insuffisante ou imprécise",
      "Caractéristiques techniques non conformes",
      "Priorité inappropriée",
      "Autre raison (veuillez préciser)"
    ];

    return (
      <Modal show={showDecisionModal} onHide={() => setShowDecisionModal(false)} centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <FaCheck className="me-2 text-primary" />
            Prendre une décision
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4">
            <h5 className="mb-3">Demande #{currentDemande?.id}</h5>
            <p className="text-muted">{currentDemande?.projet_nom}</p>
            {currentDemande?.projet_cout_estimatif && (
              <div className="alert alert-info p-2 mt-2 small">
                <FaInfoCircle className="me-2" />
                Coût estimatif du projet: {currentDemande.projet_cout_estimatif} DT |
                Budget demandé: {currentDemande.budget} DT
              </div>
            )}
          </div>

          <Form>
            <div className="decision-options mb-4">
              <h6 className="mb-3">Votre décision:</h6>
              <div className="d-flex gap-3">
                <Button
                  variant={decision === 'Approuvé' ? 'success' : 'outline-success'}
                  className="flex-grow-1 decision-btn"
                  onClick={() => setDecision('Approuvé')}
                >
                  <FaCheck className="me-2" />
                  Approuver
                </Button>
                <Button
                  variant={decision === 'Rejeté' ? 'danger' : 'outline-danger'}
                  className="flex-grow-1 decision-btn"
                  onClick={() => setDecision('Rejeté')}
                >
                  <FaTimes className="me-2" />
                  Rejeter
                </Button>
              </div>
            </div>

            {decision === 'Rejeté' && (
              <Form.Group className="mb-3">
                <Form.Label>Motif de refus *</Form.Label>

                <div className="mb-3">
                  {preDefinedReasons.map((reason, index) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`reason-${index}`}
                      label={reason}
                      name="rejectionReason"
                      className="mb-2"
                      onChange={() => {
                        if (index === preDefinedReasons.length - 1) {
                          setMotif(""); // Reset pour permettre la saisie manuelle
                        } else {
                          setMotif(reason);
                        }
                      }}
                    />
                  ))}
                </div>

                {motif && !preDefinedReasons.includes(motif) && (
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    placeholder="Veuillez expliquer en détail les raisons du refus..."
                    className="border-primary"
                  />
                )}

                <Form.Text className="text-muted">
                  Ce motif sera visible par le demandeur et le validateur niveau 1.
                </Form.Text>
              </Form.Group>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-top-0">
          <Button variant="outline-secondary" onClick={() => setShowDecisionModal(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmitDecision}
            disabled={!decision || (decision === 'Rejeté' && !motif.trim())}
          >
            Confirmer la décision
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  function renderDetailsModal() {
    if (!selectedDemande) return null;

    return (
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)} size="lg" centered>
        <Modal.Header closeButton className="bg-light">
          <Modal.Title>
            <FaInfoCircle className="me-2 text-primary" />
            Détails complète de la demande #{selectedDemande.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="demande-details">
            <div className="row mb-4">
              <div className="col-md-6">
                <h5 className="detail-section-title">Informations de base</h5>
                <div className="detail-item">
                  <span className="detail-label">Projet:</span>
                  <span className="detail-value">{selectedDemande.projet_nom}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Description:</span>
                  <span className="detail-value">{selectedDemande.description}</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Priorité:</span>
                  <span className="detail-value">
                    <Badge bg={getPriorityColor(selectedDemande.priorite)}>
                      {selectedDemande.priorite || 'Non spécifiée'}
                    </Badge>
                  </span>
                </div>
              </div>
              <div className="col-md-6">
                <div className="detail-item">
                  <span className="detail-label">Budget:</span>
                  <span className="detail-value">{selectedDemande.budget} DT</span>
                </div>
                <div className="detail-item">
                  <span className="detail-label">Quantité:</span>
                  <span className="detail-value">{selectedDemande.quantite}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">Date création:</span>
                  <span className="detail-value">
                    {new Date(selectedDemande.date_creation).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mb-4">
              <h5 className="detail-section-title">Caractéristiques techniques</h5>
              <div className="card card-body bg-light">
                {selectedDemande.caracteristique_tech || 'Aucune caractéristique technique spécifiée'}
              </div>
            </div>

            <div className="validation-timeline mb-4">
              <h5 className="detail-section-title">Processus de validation</h5>
              <div className="timeline">
                <div className="timeline-item">
                  <div className="timeline-point"></div>
                  <div className="timeline-content">
                    <h6>Validation Niveau 1</h6>
                    <div className="d-flex align-items-center">
                      {selectedDemande.validateur1_decision === 'Approuvé' ? (
                        <Badge bg="success" className="me-2"><FaCheck /></Badge>
                      ) : (
                        <Badge bg="danger" className="me-2"><FaTimes /></Badge>
                      )}
                      <span>
                        {selectedDemande.validateur1_decision || 'En attente'} 
                      </span>
                    </div>
                    {selectedDemande.validateur1_motif && (
                      <div className="timeline-note mt-2">
                        <strong>Motif:</strong> {selectedDemande.validateur1_motif}
                      </div>
                    )}
                  </div>
                </div>
                <div className="timeline-item">
                  <div className="timeline-point"></div>
                  <div className="timeline-content">
                    <h6>Validation Niveau 2 (Finale)</h6>
                    <div className="d-flex align-items-center">
                      {selectedDemande.validateur2_decision ? (
                        selectedDemande.validateur2_decision === 'Approuvé' ? (
                          <Badge bg="success" className="me-2"><FaCheck /></Badge>
                        ) : (
                          <Badge bg="danger" className="me-2"><FaTimes /></Badge>
                        )
                      ) : (
                        <Badge bg="secondary" className="me-2">En attente</Badge>
                      )}
                      <span>
                        {selectedDemande.validateur2_decision || 'Non traité'} -
                        {selectedDemande.validateur2_date && new Date(selectedDemande.validateur2_date).toLocaleString()}
                      </span>
                    </div>
                    {selectedDemande.validateur2_motif && (
                      <div className="timeline-note mt-2">
                        <strong>Motif:</strong> {selectedDemande.validateur2_motif}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {selectedDemande.fichier_chemin && (
              <div className="attachments">
                <h5 className="detail-section-title">Pièce jointe</h5>
                <Button
                  variant="outline-primary"
                  onClick={() => downloadFile(selectedDemande.fichier_chemin)}
                >
                  <FaDownload className="me-2" />
                  Télécharger le fichier
                </Button>
              </div>
            )}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
            Fermer
          </Button>
          {!selectedDemande.validateur2_decision && selectedDemande.statut === 'En validation 2' && (
            <Button
              variant="primary"
              onClick={() => {
                setShowDetailsModal(false);
                handleDecision(selectedDemande);
              }}
            >
              Prendre une décision
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    );
  }
};

export default Consulterdemande2;