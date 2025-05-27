import React, { useState } from "react";
import { Table, Button, Modal } from "react-bootstrap";
import { FaEdit, FaEye } from "react-icons/fa";


const UserTable = ({ users, handleEdit, handleDelete }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleShowDetails = (user) => {
    setSelectedUser(user);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedUser(null);
  };

  // Fonction pour afficher le libellé du rôle
  const getRoleLabel = (role) => {
    switch(role) {
      case 'validateur1': return 'Validateur1 (Demandeuse)';
      case 'validateur2': return 'Validateur2 (Structure Achats)';
      default: return role;
    }
  };

  return (
    <>
      <Table striped bordered hover>

        
        <thead>
          <tr>
            <th>Nom</th>
            <th>Prénom</th>
            <th>CIN</th>
            <th>Matricule</th>
            <th>Email</th>
            <th>Rôle</th>
            <th>Département</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.nom}</td>
              <td>{user.prenom}</td>
              <td>{user.cin}</td>
              <td>{user.matricule}</td>
              <td>{user.email}</td>
              <td>{getRoleLabel(user.role)}</td>
              <td>{user.departement_nom || '-'}</td>
              <td>{user.statut_type}</td>
              <td>
                <div className="d-flex">
                  <Button
                    variant="info"
                    size="sm"
                    className="me-2"
                    onClick={() => handleShowDetails(user)}
                  >
                    <FaEye />
                  </Button>
                  <Button
                    variant="success"
                    size="sm"
                    className="me-2"
                    onClick={() => handleEdit(user)}
                  >
                    <FaEdit />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showDetails} onHide={handleCloseDetails} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails de l'utilisateur</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedUser && (
            <div className="row">
              <div className="col-md-6">
                <p><strong>Nom:</strong> {selectedUser.nom}</p>
                <p><strong>Prénom:</strong> {selectedUser.prenom}</p>
                <p><strong>CIN:</strong> {selectedUser.cin}</p>
                <p><strong>Matricule:</strong> {selectedUser.matricule}</p>
                

                <p><strong>Date Naissance:</strong> {selectedUser.dateNaissance || '-'}</p>
              </div>
              <div className="col-md-6">
                <p><strong>Adresse:</strong> {selectedUser.adresse || '-'}</p>
                <p><strong>Email:</strong> {selectedUser.email}</p>
                <p><strong>Rôle:</strong> {getRoleLabel(selectedUser.role)}</p>
                <p><strong>Département:</strong> {selectedUser.departement_nom || '-'}</p>
                <p><strong>Statut:</strong> {selectedUser.statut_type}</p>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDetails}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserTable;