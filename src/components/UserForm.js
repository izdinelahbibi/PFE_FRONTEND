import React, { useEffect, useState } from "react";
import { Modal, Form, Button } from "react-bootstrap";
import departementService from "../services/departementService";

const UserForm = ({
  showForm,
  handleSubmit,
  handleChange,
  formData,
  resetForm,
  editingUser,
}) => {
  const [departements, setDepartements] = useState([]);

  useEffect(() => {
    const loadDepartements = async () => {
      try {
        const data = await departementService.getDepartements();
        setDepartements(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des départements:", error);
      }
    };
    loadDepartements();
  }, []);

  return (
    <Modal show={showForm} onHide={resetForm} animation={true}>
      <Modal.Header closeButton>
        <Modal.Title>{editingUser ? "Modifier" : "Ajouter"} un Utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          {["nom", "prenom", "cin", "matricule", "email", "password"].map((field) => (
            <Form.Group className="mb-3" key={field}>
              <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
              <Form.Control
                type={field === "email" ? "email" : "text"}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </Form.Group>
          ))}

          <Form.Group className="mb-3">
            <Form.Label>Rôle</Form.Label>
            <Form.Select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="employé">Employé</option>
              <option value="validateur">Validateur</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Département</Form.Label>
            <Form.Select
              name="departement_id"
              value={formData.departement_id || ""}
              onChange={handleChange}
              required
            >
              <option value="">Sélectionner un département</option>
              {departements.map((departement) => (
                <option key={departement.id} value={departement.id}>
                  {departement.nom}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <Button type="submit" className="me-2">
            {editingUser ? "Modifier" : "Ajouter"}
          </Button>
          <Button variant="secondary" onClick={resetForm}>
            Annuler
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserForm;
