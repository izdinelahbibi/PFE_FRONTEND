import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Alert, Badge, Card, Spinner } from 'react-bootstrap';
import { 
  fetchDemandesAValider, 
  validerDemande,
  rejeterDemande,
  downloadFichierDemande
} from '../../../services/demandeAchatService';
import { FaCheck, FaTimes, FaDownload, FaInfoCircle } from 'react-icons/fa';
import './ConsulterDemande.css';

const ConsulterDemande = ({ isSidebarOpen }) => {
  const [demandes, setDemandes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [motifRefus, setMotifRefus] = useState('');
  const [alert, setAlert] = useState({ show: false, message: '', variant: 'success' });
  const [isLoading, setIsLoading] = useState(false);

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  const loadDemandes = async () => {
    setIsLoading(true);
    try {
      const data = await fetchDemandesAValider();
      setDemandes(data);
    } catch (error) {
      showAlert(error.message || 'Erreur lors du chargement des demandes', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDemandes();
  }, []);

  const showAlert = (message, variant) => {
    setAlert({ show: true, message, variant });
    setTimeout(() => setAlert({ ...alert, show: false }), 5000);
  };

  const handleOpenRejetModal = (demande) => {
    setSelectedDemande(demande);
    setMotifRefus('');
    setShowModal(true);
  };

  const handleValider = async (id) => {
    try {
      await validerDemande(id);
      await loadDemandes();
      showAlert('Demande validée avec succès', 'success');
    } catch (error) {
      showAlert(error.message || 'Erreur lors de la validation', 'danger');
    }
  };

  const handleRejeter = async () => {
    if (!motifRefus.trim()) {
      showAlert('Veuillez saisir un motif de refus valide', 'warning');
      return;
    }

    try {
      await rejeterDemande(selectedDemande.id, motifRefus);
      await loadDemandes();
      setShowModal(false);
      showAlert('Demande rejetée avec succès', 'success');
    } catch (error) {
      showAlert(error.message || 'Erreur lors du rejet', 'danger');
    }
  };

  const handleDownload = async (id) => {
    try {
      await downloadFichierDemande(id);
    } catch (error) {
      showAlert(error.message || 'Erreur lors du téléchargement', 'danger');
    }
  };

  const getStatusBadge = (statut) => {
    switch (statut) {
      case 'En attente':
        return <Badge bg="warning" text="dark">En attente</Badge>;
      case 'En validation 2':
        return <Badge bg="info">En validation 2</Badge>;
      case 'Approuvé':
        return <Badge bg="success">Approuvé</Badge>;
      case 'Rejeté':
        return <Badge bg="danger">Rejeté</Badge>;
      default:
        return <Badge bg="secondary">{statut}</Badge>;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="consulter-demande-container" style={containerStyle}>
      <h2 className="mb-4">Demandes à Valider (Niveau 1)</h2>
      
      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {isLoading ? (
        <div className="text-center">
          <Spinner animation="border" variant="primary" />
          <p>Chargement en cours...</p>
        </div>
      ) : demandes.length === 0 ? (
        <Card className="text-center p-5">
          <Card.Body>
            <FaInfoCircle size={48} className="text-secondary mb-3" />
            <Card.Title>Aucune demande à valider</Card.Title>
            <Card.Text>Toutes les demandes ont été traitées ou aucune nouvelle demande n'est en attente.</Card.Text>
          </Card.Body>
        </Card>
      ) : (
        <div className="table-responsive">
          <Table striped bordered hover className="mt-3">
            <thead className="table-dark">
              <tr>
                <th>Référence</th>
                <th>Demandeur</th>
                <th>Projet</th>
                <th>Description</th>
                <th>Quantite</th>
                <th>Budget</th>
                <th>Date</th>
                <th>Statut</th>
                <th>Actions</th>
            
              </tr>
            </thead>
            <tbody>
              {demandes.map((demande) => (
                <tr key={demande.id}>
                  <td>DA-{demande.id.toString().padStart(4, '0')}</td>
                  <td>{demande.demandeur_nom}</td>
                  <td>{demande.projet_nom}</td>
                  <td>{demande.description}</td>
                  <td>{demande.quantite}</td>
                  <td>{parseFloat(demande.budget).toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €</td>
                  <td>{formatDate(demande.date_creation)}</td>
                  <td>{getStatusBadge(demande.statut)}</td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <Button 
                        variant="success" 
                        size="sm"
                        onClick={() => handleValider(demande.id)}
                        title="Valider la demande"
                        disabled={demande.statut !== 'En attente'}
                      >
                        <FaCheck className="me-1" /> Valider
                      </Button>
                      <Button 
                        variant="danger" 
                        size="sm"
                        onClick={() => handleOpenRejetModal(demande)}
                        title="Rejeter la demande"
                        disabled={demande.statut !== 'En attente'}
                      >
                        <FaTimes className="me-1" /> Rejeter
                      </Button>
                      {demande.fichier_chemin && (
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleDownload(demande.id)}
                          title="Télécharger le fichier"
                        >
                          <FaDownload />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      )}

      {/* Modal pour le rejet */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Motif de rejet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Veuillez indiquer le motif de rejet :</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={motifRefus}
                onChange={(e) => setMotifRefus(e.target.value)}
                placeholder="Le motif de rejet est obligatoire..."
                required
              />
            </Form.Group>
            {selectedDemande && (
              <Card className="mb-3">
                <Card.Body>
                  <Card.Title>Détails de la demande</Card.Title>
                  <p><strong>Référence :</strong> DA-{selectedDemande.id.toString().padStart(4, '0')}</p>
                  <p><strong>Projet :</strong> {selectedDemande.projet_nom}</p>
                  <p><strong>Description :</strong> {selectedDemande.description}</p>
                </Card.Body>
              </Card>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleRejeter}>
            Confirmer le rejet
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConsulterDemande;