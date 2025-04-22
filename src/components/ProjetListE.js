import React, { useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import { Eye, Pencil } from 'react-bootstrap-icons';
import './ProjetList.css';

const ProjetList = ({ projets, rubriques, openModal, openEditModal, handleShowDepenses }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  const getRubriqueName = (rubriqueId) => {
    if (!rubriqueId) return 'Non spécifié';
    const rubrique = rubriques.find(r => r.id === rubriqueId);
    return rubrique ? rubrique.nom : 'Non spécifié';
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjets = projets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(projets.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="projet-list-container">
      <Button onClick={openModal} variant="success" className="add-projet-button mb-3">
        + Ajouter un projet
      </Button>

      {projets.length === 0 ? (
        <div className="alert alert-info">Aucun projet trouvé</div>
      ) : (
        <>
          <Table className="projet-table" striped bordered hover responsive>
            <thead>
              <tr>
                <th>Intitulé</th>
                <th>Rubrique</th>
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
              {currentProjets.map((projet) => (
                <tr key={projet.id}>
                  <td>{projet.intitule}</td>
                  <td>{getRubriqueName(projet.rubrique_id)}</td>
                  <td>{projet.type_investissement}</td>
                  <td>{projet.site}</td>
                  <td className="text-truncate" style={{ maxWidth: '150px' }} title={projet.presentation_projet}>
                    {projet.presentation_projet}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '150px' }} title={projet.opportunite}>
                    {projet.opportunite}
                  </td>
                  <td className="text-truncate" style={{ maxWidth: '150px' }} title={projet.composantes_projet}>
                    {projet.composantes_projet}
                  </td>
                  <td>{projet.cout_estimatif ? `${projet.cout_estimatif} €` : 'Non spécifié'}</td>
                  <td>{new Date(projet.date_creation).toLocaleDateString()}</td>
                  <td>
                    <div className="d-flex gap-2">
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
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(projet)}
                        title="Modifier le projet"
                      >
                        <Pencil className="me-1" />
                        Modifier
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          <Pagination>
            {[...Array(totalPages)].map((_, idx) => (
              <Pagination.Item
                key={idx + 1}
                active={idx + 1 === currentPage}
                onClick={() => paginate(idx + 1)}
              >
                {idx + 1}
              </Pagination.Item>
            ))}
          </Pagination>
        </>
      )}
    </div>
  );
};

export default ProjetList;