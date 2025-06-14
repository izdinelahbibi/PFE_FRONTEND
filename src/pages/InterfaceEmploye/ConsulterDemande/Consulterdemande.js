import React, { useState, useEffect, useRef } from 'react';
import { Table, Spinner, Alert, Button, Modal, Form, Badge } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../ConsulterDemande/ConsulterDemande.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Pencil, Trash } from 'react-bootstrap-icons';

const ConsulterDemande = ({ isSidebarOpen }) => {
  const [demandes, setDemandes] = useState([]);
  const [filteredDemandes, setFilteredDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [searchDate, setSearchDate] = useState('');
  const [searchStatus, setSearchStatus] = useState('');
  const [prediction, setPrediction] = useState(null);
  const [predictionLoading, setPredictionLoading] = useState(false);
  const [predictionError, setPredictionError] = useState(null);
  const [highlightedRowId, setHighlightedRowId] = useState(null);
  const modifiedRowRef = useRef(null);

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
    maxWidth: '100%',
    overflowX: 'auto'
  };

  const fetchDemandes = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/demandeachats`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des demandes d\'achats');
      }

      const data = await response.json();
      console.log('API Response (demandes):', data); // Debug API response
      const sortedData = data.sort((a, b) => 
        new Date(b.date_creation) - new Date(a.date_creation)
      );
      setDemandes(sortedData);
      setFilteredDemandes(sortedData);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDemandes();
  }, []);

  useEffect(() => {
    let filtered = [...demandes];

    if (searchDate) {
      filtered = filtered.filter((demande) =>
        new Date(demande.date_creation).toISOString().split('T')[0] === searchDate
      );
    }

    if (searchStatus) {
      filtered = filtered.filter((demande) => {
        const statut = demande.statut_final?.trim().toLowerCase() || 'en attente'; // Normalize and default to 'en attente'
        return statut === searchStatus.trim().toLowerCase();
      });
    }

    setFilteredDemandes(filtered);
    console.log('Filtered Demandes:', filtered); // Debug filtered results
  }, [searchDate, searchStatus, demandes]);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/demandeachats/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la suppression de la demande d\'achat');
      }

      await fetchDemandes();
      toast.success('Demande supprimée avec succès !');
    } catch (err) {
      setError(err.message);
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const handleEdit = (demande) => {
    setSelectedDemande({ ...demande });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDemande(null);
  };

  const handleSaveChanges = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/demandeachats/${selectedDemande.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(selectedDemande),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la modification de la demande d\'achat');
      }

      const updatedDemande = await response.json();
      console.log('API Response (updatedDemande):', updatedDemande);

      await fetchDemandes();

      setHighlightedRowId(updatedDemande.id);
      setTimeout(() => setHighlightedRowId(null), 3000);

      handleCloseModal();
      toast.success('Demande modifiée avec succès !');

      setTimeout(() => {
        if (modifiedRowRef.current) {
          modifiedRowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } catch (err) {
      setError(err.message);
      toast.error(`Erreur: ${err.message}`);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSelectedDemande({
      ...selectedDemande,
      [name]: value,
    });
  };

  const handlePredict = async (demande) => {
    setPredictionLoading(true);
    setPredictionError(null);
    setPrediction(null);

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      if (demande.statut_final === 'Approuvé' || demande.statut_final === 'Rejeté') {
        throw new Error('La demande a déjà été traitée, impossible de prédire le délai');
      }

      const predictionData = {
        ...demande,
        jour_semaine_creation: new Date(demande.date_creation).getDay() + 1,
        heure_creation: new Date(demande.date_creation).getHours()
      };

      const response = await fetch(
        `${process.env.REACT_APP_PREDICTION_API_URL || 'http://localhost:5001'}/predict-delai`, 
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(predictionData),
        }
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }
        throw new Error(errorData.message || 'Erreur lors de la prédiction');
      }

      const data = await response.json();
      const delaiJoursDecimal = data.delai_estime_jours;
      setPrediction({
        jours: Math.floor(delaiJoursDecimal),
        heures: Math.round((delaiJoursDecimal % 1) * 24)
      });
      toast.success('Prédiction effectuée avec succès !');
    } catch (err) {
      setPredictionError(err.message);
      toast.error(`Erreur: ${err.message}`);
    } finally {
      setPredictionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={containerStyle} className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" role="status" className="custom-spinner">
          <span className="visually-hidden">Chargement en cours...</span>
        </Spinner>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <Alert variant="danger" className="text-center custom-alert">
          Erreur: {error}
        </Alert>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <ToastContainer />
      <h2 className="text-center mb-4">Liste des Demandes d'Achats</h2>

      <Form className="mb-4">
        <Form.Group controlId="formSearchDate" className="mb-3">
          <Form.Label>Filtrer par date de création</Form.Label>
          <Form.Control
            type="date"
            value={searchDate}
            onChange={(e) => setSearchDate(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="formSearchStatus" className="mb-3">
          <Form.Label>Filtrer par statut</Form.Label>
          <Form.Select
            value={searchStatus}
            onChange={(e) => setSearchStatus(e.target.value)}
          >
            <option value="">Tous les statuts</option>
            <option value="En attente">En attente</option>
            <option value="Approuvé">Approuvé</option>
            <option value="Rejeté">Rejeté</option>
          </Form.Select>
        </Form.Group>
      </Form>

      {predictionLoading && (
        <div className="text-center mb-3">
          <Spinner animation="border" variant="info" />
          <p>Calcul de la prédiction en cours...</p>
        </div>
      )}
      
      {predictionError && (
        <Alert variant="danger" className="text-center">
          {predictionError}
        </Alert>
      )}
      
      {prediction !== null && (
        <Alert variant={prediction.jours > 7 ? "warning" : "success"} className="text-center">
          <strong>Délai de validation estimé :</strong> 
          {prediction.jours > 0 && `${prediction.jours} jour${prediction.jours > 1 ? 's' : ''}`}
          {prediction.jours > 0 && prediction.heures > 0 && ' et '}
          {prediction.heures > 0 && `${prediction.heures} heure${prediction.heures > 1 ? 's' : ''}`}
          {prediction.jours === 0 && prediction.heures === 0 && 'Moins d\'une heure'}
          
          {prediction.jours > 7 && (
            <div className="mt-2">
              <Badge bg="danger">Délai long</Badge>
            </div>
          )}
        </Alert>
      )}

      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        <Table striped bordered hover responsive className="custom-table" style={{ tableLayout: 'auto', width: '100%' }}>
          <thead style={{ position: 'sticky', top: 0, background: '#fff', zIndex: 1 }}>
            <tr>
              <th style={{ minWidth: '100px' }}>N° Demande</th>
              <th style={{ minWidth: '150px' }}>Projet</th>
              <th style={{ minWidth: '200px' }}>Description</th>
              <th style={{ minWidth: '100px' }}>Quantité</th>
              <th style={{ minWidth: '100px' }}>Budget</th>
              <th style={{ minWidth: '200px' }}>Caractéristiques Techniques</th>
              <th style={{ minWidth: '150px' }}>Motif de Refus</th>
              <th style={{ minWidth: '120px' }}>Statut</th>
              <th style={{ minWidth: '120px' }}>Date de Création</th>
              <th style={{ minWidth: '120px' }}>Actions</th>
              <th style={{ minWidth: '120px' }}>Prédiction</th>
            </tr>
          </thead>
          <tbody>
            {filteredDemandes.map((demande) => (
              <tr
                key={demande.id}
                ref={highlightedRowId === demande.id ? modifiedRowRef : null}
                style={highlightedRowId === demande.id ? { backgroundColor: '#e0f7fa' } : {}}
              >
                <td>DA-{demande.id}</td>
                <td>{demande.projet_intitule}</td>
                <td>{demande.description}</td>
                <td>{demande.quantite}</td>
                <td>{demande.budget}</td>
                <td>{demande.caracteristique_tech}</td>
                <td>{demande.validateur2_motif || 'N/A'}</td>
                <td>
                  <Badge 
                    bg={
                      demande.statut_final === 'Approuvé' ? 'success' : 
                      demande.statut_final === 'Rejeté' ? 'danger' : 
                      'warning'
                    }
                  >
                    {demande.statut_final || 'En attente'}
                  </Badge>
                </td>
                <td>{new Date(demande.date_creation).toLocaleDateString()}</td>
                <td>
                  {demande.statut_final === 'Approuvé' || demande.statut_final === 'Rejeté' ? (
                    <span style={{ color: demande.statut_final === 'Approuvé' ? 'green' : 'red' }}>
                      {demande.statut_final === 'Approuvé' ? 'Demande approuvée' : 'Demande rejetée'}
                    </span>
                  ) : (
                    <>
                      <Button variant="success" size="sm" onClick={() => handleEdit(demande)}>
                        <Pencil />
                      </Button>{' '}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(demande.id)}>
                        <Trash />
                      </Button>
                    </>
                  )}
                </td>
                <td>
                  <Button
                    variant="info"
                    size="sm"
                    onClick={() => handlePredict(demande)}
                    disabled={predictionLoading || demande.statut_final === 'Approuvé' || demande.statut_final === 'Rejeté'}
                  >
                    Prédire Délai
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Modifier la demande</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedDemande && (
            <Form>
              <Form.Group controlId="formDescription" className="mb-3">
                <Form.Label>Description</Form.Label>
                <Form.Control
                  type="text"
                  name="description"
                  value={selectedDemande.description || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formQuantite" className="mb-3">
                <Form.Label>Quantité</Form.Label>
                <Form.Control
                  type="number"
                  name="quantite"
                  value={selectedDemande.quantite || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formBudget" className="mb-3">
                <Form.Label>Budget</Form.Label>
                <Form.Control
                  type="number"
                  name="budget"
                  value={selectedDemande.budget || ''}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group controlId="formCaracteristiqueTech" className="mb-3">
                <Form.Label>Caractéristiques Techniques</Form.Label>
                <Form.Control
                  as="textarea"
                  name="caracteristique_tech"
                  value={selectedDemande.caracteristique_tech || ''}
                  onChange={handleChange}
                  rows={3}
                />
              </Form.Group>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleSaveChanges}>
            Enregistrer
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ConsulterDemande;