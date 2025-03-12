import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap'; // Importez les composants Bootstrap

const AddProjetModal = ({ isModalOpen, closeModal, handleSubmit, handleInputChange, newProjet }) => {
  return (
    <Modal show={isModalOpen} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Ajouter un nouveau projet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formIntitule">
            <Form.Label>Intitulé:</Form.Label>
            <Form.Control
              type="text"
              name="intitule"
              value={newProjet.intitule}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formTypeInvestissement">
            <Form.Label>Type d'investissement:</Form.Label>
            <Form.Control
              type="text"
              name="type_investissement"
              value={newProjet.type_investissement}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formSite">
            <Form.Label>Site:</Form.Label>
            <Form.Control
              type="text"
              name="site"
              value={newProjet.site}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPresentationProjet">
            <Form.Label>Présentation du projet:</Form.Label>
            <Form.Control
              as="textarea"
              name="presentation_projet"
              value={newProjet.presentation_projet}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formCoutEstimatif">
            <Form.Label>Coût estimatif:</Form.Label>
            <Form.Control
              type="text"
              name="cout_estimatif"
              value={newProjet.cout_estimatif}
              onChange={handleInputChange}
              required
            />
          </Form.Group>
          <Form.Group controlId="formPlanning">
            <Form.Label>Planning:</Form.Label>
            <Form.Control
              as="select"
              name="planning"
              value={newProjet.planning}
              onChange={handleInputChange}
              required
            >
              <option value="Annuel">Annuel</option>
              <option value="Mensuel">Mensuel</option>
              <option value="Trimestriel">Trimestriel</option>
            </Form.Control>
          </Form.Group>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeModal}>
              Annuler
            </Button>
            <Button variant="primary" type="submit">
              Ajouter
            </Button>
          </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProjetModal;