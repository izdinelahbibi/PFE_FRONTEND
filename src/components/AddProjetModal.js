import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { fetchRubriques } from '../services/rubriqueService';

const AddProjetModal = ({ 
  isModalOpen, 
  closeModal, 
  handleSubmit, 
  handleInputChange, 
  newProjet,
}) => {
  const [rubriques, setRubriques] = useState([]);
  const [loadingRubriques, setLoadingRubriques] = useState(false);
  const [error, setError] = useState(null);
  const [step, setStep] = useState(1); // 1: Sélection rubrique, 2: Formulaire projet

  useEffect(() => {
    if (isModalOpen) {
      loadRubriques();
    }
  }, [isModalOpen]);

  const loadRubriques = async () => {
    try {
      setLoadingRubriques(true);
      const data = await fetchRubriques();
      setRubriques(data);
      setError(null);
    } catch (err) {
      setError('Erreur lors du chargement des rubriques');
      console.error(err);
    } finally {
      setLoadingRubriques(false);
    }
  };

  const handleRubriqueSelect = (rubriqueId) => {
    handleInputChange({
      target: {
        name: 'rubrique_id',
        value: rubriqueId
      }
    });
    setStep(2);
  };

  const handleBackToRubriqueSelection = () => {
    setStep(1);
  };

  return (
    <Modal show={isModalOpen} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          {step === 1 ? 'Sélectionner une rubrique' : 'Ajouter un nouveau projet'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {step === 1 ? (
          <div>
            {loadingRubriques ? (
              <div className="text-center my-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Chargement...</span>
                </div>
              </div>
            ) : error ? (
              <Alert variant="danger">{error}</Alert>
            ) : rubriques.length === 0 ? (
              <Alert variant="info">Aucune rubrique disponible</Alert>
            ) : (
              <div className="rubrique-selection-container">
                <h5 className="mb-3">Veuillez sélectionner une rubrique :</h5>
                <div className="list-group">
                  {rubriques.map((rubrique) => (
                    <button
                      key={rubrique.id}
                      type="button"
                      className="list-group-item list-group-item-action"
                      onClick={() => handleRubriqueSelect(rubrique.id)}
                    >
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{rubrique.nom}</span>
                        <span className="badge bg-primary rounded-pill">
                          <i className="fas fa-chevron-right"></i>
                        </span>
                      </div>
                      {rubrique.description && (
                        <small className="text-muted d-block mt-1">
                          {rubrique.description}
                        </small>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <Form onSubmit={handleSubmit}>
            <div className="mb-3 p-3 bg-light rounded">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong>Rubrique sélectionnée :</strong> 
                  {rubriques.find(r => r.id === newProjet.rubrique_id)?.nom || 'Non sélectionnée'}
                </div>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={handleBackToRubriqueSelection}
                >
                  Changer
                </Button>
              </div>
            </div>

            <Form.Group controlId="formIntitule" className="mb-3">
              <Form.Label>Intitulé:</Form.Label>
              <Form.Control
                type="text"
                name="intitule"
                value={newProjet.intitule}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formTypeInvestissement" className="mb-3">
              <Form.Label>Type d'investissement:</Form.Label>
              <Form.Control
                type="text"
                name="type_investissement"
                value={newProjet.type_investissement}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formSite" className="mb-3">
              <Form.Label>Site:</Form.Label>
              <Form.Control
                type="text"
                name="site"
                value={newProjet.site}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formOpportunite" className="mb-3">
              <Form.Label>Opportunité:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="opportunite"
                value={newProjet.opportunite}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formComposantesProjet" className="mb-3">
              <Form.Label>Composantes projet:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="composantes_projet"
                value={newProjet.composantes_projet}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formPresentationProjet" className="mb-3">
              <Form.Label>Présentation du projet:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="presentation_projet"
                value={newProjet.presentation_projet}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formCoutEstimatif" className="mb-3">
              <Form.Label>Coût estimatif (DT):</Form.Label>
              <Form.Control
                type="number"
                name="cout_estimatif"
                value={newProjet.cout_estimatif}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                required
              />
            </Form.Group>

            <Form.Group controlId="formPlanning" className="mb-3">
              <Form.Label>Planning:</Form.Label>
              <Form.Control
                as="select"
                name="planning"
                value={newProjet.planning}
                onChange={handleInputChange}
                required
              >
                <option value="Annuel">Annuel</option>
               
              </Form.Control>
            </Form.Group>

            <Modal.Footer>
              <Button variant="secondary" onClick={closeModal}>
                Annuler
              </Button>
              <Button variant="primary" type="submit">
                Ajouter le projet
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default AddProjetModal;