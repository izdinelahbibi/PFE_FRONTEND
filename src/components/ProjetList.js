import React from 'react';
import { Table, Button } from 'react-bootstrap';
import { Eye, InfoCircle } from 'react-bootstrap-icons';
import './ProjetListE.css';

const ProjetList = ({ projets, openModal, handleOpenPlanningModal, handleShowDepenses, handleShowDetails }) => {
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
                <td>{projet.cout_estimatif ? `${projet.cout_estimatif} DT` : 'Non spécifié'}</td>
                <td>{new Date(projet.date_creation).toLocaleDateString()}</td>
                <td>
                  <div className="d-flex gap-2">
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
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleShowDetails(projet.id)}
                      title="Voir les détails"
                    >
                      <InfoCircle className="me-1" />
                      Détails
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