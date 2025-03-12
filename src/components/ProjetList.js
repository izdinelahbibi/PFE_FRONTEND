import React from 'react';
import { Table, Button } from 'react-bootstrap';
import './ProjetList.css'; // Importer le fichier CSS

const ProjetList = ({ projets, openModal }) => {
  return (
    <div className="projet-list-container">
      <h2 className="projet-list-title">Projets du Département</h2>
      <Button onClick={openModal} variant="success" className="add-projet-button">
        + Ajouter un projet
      </Button>
      <Table className="projet-table" striped bordered hover responsive>
        <thead>
          <tr>
            <th>Intitulé</th>
            <th>Type d'investissement</th>
            <th>Site</th>
            <th>Présentation du projet</th>
            <th>Coût estimatif</th>
            <th>Date de création</th>
            <th>Planning</th>
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
              <td>{new Date(projet.date_creation).toLocaleDateString()}</td>
              <td>{projet.planning}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ProjetList;