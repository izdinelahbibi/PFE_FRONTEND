import React from 'react';
import { Table, Button } from 'react-bootstrap';

const ProjetListA = ({ projets, openEditModal, handleDeleteProjet }) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Intitulé</th>
          <th>Type d'investissement</th>
          <th>Site</th>
          <th>Présentation</th>
          <th>Coût estimatif</th>
          <th>Planning</th>
          <th>Département</th> {/* Nouvelle colonne */}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projets.map((projet) => (
          <tr key={projet.id}>
            <td>{projet.intitule}</td>
            <td>{projet.type_investissement}</td>
            <td>{projet.site}</td>
            <td>{projet.presentation_projet}</td>
            <td>{projet.cout_estimatif}</td>
            <td>{projet.planning}</td>
            <td>{projet.departement_nom}</td> {/* Afficher le département */}
            <td>
              <Button
                variant="warning"
                onClick={() => openEditModal(projet)}
                className="me-2"
              >
                Modifier
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDeleteProjet(projet.id)}
              >
                Supprimer
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProjetListA;