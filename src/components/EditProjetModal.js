import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const EditProjetModal = ({ isModalOpen, closeModal, handleSubmit, handleInputChange, currentProjet, rubriques }) => {
  if (!currentProjet) return null;

  return (
    <Modal show={isModalOpen} onHide={closeModal} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Modifier le projet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Intitulé</Form.Label>
            <Form.Control
              type="text"
              name="intitule"
              value={currentProjet.intitule || ''}
              onChange={handleInputChange}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Rubrique</Form.Label>
            <Form.Select
              name="rubrique_id"
              value={currentProjet.rubrique_id || ''}
              onChange={handleInputChange}
            >
              <option value="">Sélectionner une rubrique</option>
              {rubriques.map((rubrique) => (
                <option key={rubrique.id} value={rubrique.id}>
                  {rubrique.nom}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Type d'investissement</Form.Label>
            <Form.Control
              type="text"
              name="type_investissement"
              value={currentProjet.type_investissement || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Site</Form.Label>
            <Form.Control
              type="text"
              name="site"
              value={currentProjet.site || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Opportunité</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="opportunite"
              value={currentProjet.opportunite || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Composantes du projet</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              name="composantes_projet"
              value={currentProjet.composantes_projet || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Présentation du projet</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="presentation_projet"
              value={currentProjet.presentation_projet || ''}
              onChange={handleInputChange}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Coût estimatif (€)</Form.Label>
            <Form.Control
              type="number"
              name="cout_estimatif"
              value={currentProjet.cout_estimatif || ''}
              onChange={handleInputChange}
              min="0"
              step="0.01"
            />
          </Form.Group>

          <div className="d-flex justify-content-end">
            <Button variant="secondary" onClick={closeModal} className="me-2">
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Enregistrer les modifications
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProjetModal;