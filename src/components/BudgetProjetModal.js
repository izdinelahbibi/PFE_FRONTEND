import React from 'react';
import { Modal, Table, Button } from 'react-bootstrap';

const BudgetProjetModal = ({ show, onHide, budget }) => {
  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Détail Budget du Projet</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {budget && budget.length > 0 ? (
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Année</th>
                <th>Montant (DT)</th>
              </tr>
            </thead>
            <tbody>
              {budget.map((item, index) => (
                <tr key={index}>
                  <td>{item.annee}</td>
                  <td>{item.montant.toLocaleString('fr-FR')} DT</td>
                </tr>
              ))}
            </tbody>
          </Table>
        ) : (
          <p>Aucun budget disponible pour ce projet.</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Fermer</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BudgetProjetModal;