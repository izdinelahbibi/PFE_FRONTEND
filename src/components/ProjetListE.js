import React, { useState } from 'react';
import { Table, Button, Pagination, Modal, Form } from 'react-bootstrap';
import { Eye, Pencil, Calculator, FileEarmarkArrowDown } from 'react-bootstrap-icons';
import './ProjetList.css';

const ProjetList = ({ projets, rubriques, openModal, openEditModal, handleShowDepenses, handleShowBudget, handleExportProject }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedProjet, setSelectedProjet] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const itemsPerPage = 10;

  const getRubriqueName = (rubriqueId) => {
    if (!rubriqueId) return 'Non spécifié';
    const rubrique = rubriques.find((r) => r.id === rubriqueId);
    return rubrique ? rubrique.nom : 'Non spécifié';
  };

  const openDetailsModal = (projet) => {
    setSelectedProjet(projet);
    setShowDetailsModal(true);
  };

  const closeDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedProjet(null);
  };

  // Filter projects based on search term
  const filteredProjets = projets.filter((projet) =>
    projet.intitule.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getRubriqueName(projet.rubrique_id).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProjets = filteredProjets.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProjets.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="projet-list-container">
      {/* Filtering Zone (only search input and add button) */}
      <div className="filter-zone mb-3">
        <Form>
          <div className="d-flex gap-3 flex-wrap align-items-end">
            <Form.Group style={{ width: '300px' }}>
              <Form.Label>Rechercher (Intitulé/Rubrique)</Form.Label>
              <Form.Control
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1); // Reset to first page on filter change
                }}
              />
            </Form.Group>
            <Button
              onClick={openModal}
              variant="success"
              className="add-projet-button"
            >
              + Ajouter un projet
            </Button>
          </div>
        </Form>
      </div>

      {filteredProjets.length === 0 ? (
        <div className="alert alert-info">Aucun projet trouvé</div>
      ) : (
        <>
          <Table className="projet-table" striped bordered hover responsive>
            <thead>
              <tr>
                <th>Intitulé</th>
                <th>Rubrique</th>
                <th>Coût estimatif</th>
                <th>Date de création</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentProjets.map((projet) => (
                <tr key={projet.id}>
                  <td className="truncate" data-label="Intitulé">{projet.intitule}</td>
                  <td className="truncate" data-label="Rubrique">{getRubriqueName(projet.rubrique_id)}</td>
                  <td data-label="Coût estimatif">
                    {projet.cout_estimatif ? `${projet.cout_estimatif} DT` : 'Non spécifié'}
                  </td>
                  <td data-label="Date de création">{new Date(projet.date_creation).toLocaleDateString()}</td>
                  <td data-label="Actions">
                    <div className="d-flex gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => openDetailsModal(projet)}
                        title="Voir les détails"
                      >
                        Détails
                      </Button>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => handleShowDepenses(projet.id)}
                        title="Voir les dépenses"
                      >
                        <Eye className="me-1" />
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleShowBudget(projet.id)}
                        title="Détail budgétaire"
                      >
                        <Calculator className="me-1" /> 
                      
                      </Button>
                      <Button
                        variant="warning"
                        size="sm"
                        onClick={() => openEditModal(projet)}
                        title="Modifier le projet"
                      >
                        <Pencil className="me-1" />
                      </Button>
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleExportProject(projet)}
                        title="Exporter la fiche de projet"
                      >
                        <FileEarmarkArrowDown className="me-1" />
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

      {/* Details Modal */}
      {selectedProjet && (
        <Modal show={showDetailsModal} onHide={closeDetailsModal}>
          <Modal.Header closeButton>
            <Modal.Title>Détails du Projet: {selectedProjet.intitule}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Rubrique:</strong> {getRubriqueName(selectedProjet.rubrique_id)}</p>
            <p><strong>Type d'investissement:</strong> {selectedProjet.type_investissement}</p>
            <p><strong>Site:</strong> {selectedProjet.site}</p>
            <p><strong>Présentation Projet:</strong> {selectedProjet.presentation_projet}</p>
            <p><strong>Opportunité:</strong> {selectedProjet.opportunite}</p>
            <p><strong>Composantes Projet:</strong> {selectedProjet.composantes_projet}</p>
            <p><strong>Coût estimatif:</strong> {selectedProjet.cout_estimatif ? `${selectedProjet.cout_estimatif} DT` : 'Non spécifié'}</p>
            <p><strong>Date de création:</strong> {new Date(selectedProjet.date_creation).toLocaleDateString()}</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeDetailsModal}>
              Fermer
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </div>
  );
};

export default ProjetList;