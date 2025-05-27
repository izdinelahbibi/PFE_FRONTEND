import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Eye } from 'react-bootstrap-icons';
import './ProjetList.css';

const ProjetList = ({ projets, openModal, handleOpenPlanningModal, handleShowDepenses }) => {
  return (
    <div className="projet-list-container">
      <Button onClick={openModal} variant="success" className="add-projet-button mb-3">
        + Ajouter un projet
      </Button>

      {projets.length === 0 ? (
        <div className="alert alert-info">Aucun projet trouvé</div>
      ) : (
        <Table className="projet-table" striped bordered hover responsive>
          <thead>
            <tr>
              <th>Intitulé</th>
              <th>Type d'investissement</th>
              <th>Site</th>
              <th>Présentation</th>
              <th>Opportunité</th>
              <th>Composantes</th>
              <th>Coût estimatif</th>
              <th>Date de création</th>
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
                <td>{projet.opportunite}</td>
                <td>{projet.composantes_projet}</td>
                <td>{projet.cout_estimatif ? `${projet.cout_estimatif} DT` : 'Non spécifié'}</td>
                <td>{new Date(projet.date_creation).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2">
                    {/* Bouton toujours visible mais désactivé si pas 'Annuel' */}
                    <Button
                      variant={projet.planning === 'Annuel' ? 'primary' : 'secondary'}
                      size="sm"
                      onClick={() => handleOpenPlanningModal(projet.id)}
                      disabled={projet.planning !== 'Annuel'}
                      title={projet.planning !== 'Annuel' ? "Planning non annuel" : ""}
                    >
                      Ajouter Planning
                    </Button>
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => handleShowDepenses(projet.id)}
                      title="Voir les dépenses"
                    >
                      <Eye className="me-1" />
                      Dépenses
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ProjetList;