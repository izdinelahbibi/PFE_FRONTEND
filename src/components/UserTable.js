import React from "react";
import { Table, Button } from "react-bootstrap";
import { FaEdit, FaTrash } from "react-icons/fa";

const UserTable = ({ users, handleEdit, handleDelete }) => {
  return (
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
            <td>{user.role}</td>
            <td>{user.departement_nom || "Non assigné"}</td> {/* ✅ Correction ici */}
            <td>
              <div className="d-flex">
                <Button
                  variant="success"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(user)}
                >
                  <FaEdit />
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(user.id)}>
                  <FaTrash />
                </Button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default UserTable;
