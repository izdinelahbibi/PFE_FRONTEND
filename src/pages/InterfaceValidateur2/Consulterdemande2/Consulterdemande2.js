import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge } from 'react-bootstrap';
import { FaDownload, FaEye } from 'react-icons/fa';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  getDemandesPourValidateur2,
  submitValidation2,
} from '../../../services/demandeAchatService2';

const Consulterdemande2 = ({ isSidebarOpen }) => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentDemande, setCurrentDemande] = useState(null);
  const [decision, setDecision] = useState('');
  const [motif, setMotif] = useState('');
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);

  useEffect(() => {
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      setLoading(true);
      const data = await getDemandesPourValidateur2();
      setDemandes(data);
      setLoading(false);
    } catch (err) {
      setError(err.message || 'Erreur lors de la récupération des demandes');
      setLoading(false);
    }
  };

  const handleDecision = (demande) => {
    setCurrentDemande(demande);
    setShowModal(true);
  };

  const handleSubmitDecision = async () => {
    if (!decision) {
      toast.error('Veuillez sélectionner une décision');
      return;
    }

    if (decision === 'Rejeté' && !motif.trim()) {
      toast.error('Veuillez saisir un motif de refus');
      return;
    }

    try {
      await submitValidation2(currentDemande.id, decision, motif);
      toast.success('Décision enregistrée avec succès');
      setShowModal(false);
      setDecision('');
      setMotif('');
      fetchDemandes();
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
      default:
        return <Badge bg="warning" text="dark">{statut}</Badge>;
    }
  };

  const handleShowDetails = (demande) => {
    setSelectedDemande(demande);
    setShowDetailsModal(true);
  };

  const downloadFile = (filePath) => {
    window.open(filePath, '_blank');
  };

  return (
    <div style={{ marginLeft: isSidebarOpen ? '250px' : '0', transition: 'margin-left 0.3s' }}>
      <h2 className="mb-4">Demandes à valider (Niveau 2)</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center">Chargement en cours...</div>
      ) : (
        <>
          <Table striped bordered hover responsive>
            <thead>
              <tr>
                <th>ID</th>
                <th>Projet</th>
                <th>Description</th>
                <th>Quantité</th>
                <th>Budget</th>
                <th>Statut</th>
                <th>Validation 1</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {demandes.map((demande) => (
                <tr key={demande.id}>
                  <td>{demande.id}</td>
                  <td>{demande.projet_id}</td>
                  <td>{demande.description}</td>
                  <td>{demande.quantite}</td>
                  <td>{demande.budget}</td>
                  <td>{getStatusBadge(demande.statut)}</td>
                  <td>
                    {demande.validateur1_decision === 'Approuvé' 
                      ? <Badge bg="success">Validé</Badge>
                      : <Badge bg="danger">Rejeté</Badge>}
                  </td>
                  <td>
                    <Button
                      variant="info"
                      size="sm"
                      className="me-2"
                      onClick={() => handleShowDetails(demande)}
                    >
                      <FaEye />
                    </Button>
                    {demande.fichier_chemin && (
                      <Button
                        variant="secondary"
                        size="sm"
                        className="me-2"
                        onClick={() => downloadFile(demande.fichier_chemin)}
                      >
                        <FaDownload />
                      </Button>
                    )}
                    {demande.statut === 'En attente' && demande.validateur1_decision === 'Approuvé' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleDecision(demande)}
                      >
                        Valider
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {/* Modal de décision */}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Prendre une décision</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Décision</Form.Label>
                  <Form.Select
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                  >
                    <option value="">Sélectionner une décision</option>
                    <option value="Approuvé">Approuver</option>
                    <option value="Rejeté">Rejeter</option>
                  </Form.Select>
                </Form.Group>
                {decision === 'Rejeté' && (
                  <Form.Group className="mb-3">
                    <Form.Label>Motif de refus</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={motif}
                      onChange={(e) => setMotif(e.target.value)}
                      placeholder="Saisissez le motif de refus..."
                    />
                  </Form.Group>
                )}
              </Form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={handleSubmitDecision}>
                Confirmer
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Modal de détails */}
          <Modal
            show={showDetailsModal}
            onHide={() => setShowDetailsModal(false)}
            size="lg"
          >
            <Modal.Header closeButton>
              <Modal.Title>Détails de la demande</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedDemande && (
                <div>
                  <p><strong>ID:</strong> {selectedDemande.id}</p>
                  <p><strong>Projet:</strong> {selectedDemande.projet_id}</p>
                  <p><strong>Description:</strong> {selectedDemande.description}</p>
                  <p><strong>Quantité:</strong> {selectedDemande.quantite}</p>
                  <p><strong>Budget:</strong> {selectedDemande.budget}</p>
                  <p><strong>Caractéristiques techniques:</strong> {selectedDemande.caracteristique_tech}</p>
                  <p><strong>Statut:</strong> {selectedDemande.statut}</p>
                  <p><strong>Date de création:</strong> {new Date(selectedDemande.date_creation).toLocaleString()}</p>
                  {selectedDemande.motif_refus && (
                    <p><strong>Motif de refus:</strong> {selectedDemande.motif_refus}</p>
                  )}
                  {selectedDemande.validateur1_motif && (
                    <p><strong>Motif validateur 1:</strong> {selectedDemande.validateur1_motif}</p>
                  )}
                </div>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={() => setShowDetailsModal(false)}>
                Fermer
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
};

export default Consulterdemande2;