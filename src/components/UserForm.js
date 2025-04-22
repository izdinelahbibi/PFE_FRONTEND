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
  isNewUser,
}) => {
  const [departements, setDepartements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadDepartements = async () => {
      try {
        setLoading(true);
        const data = await departementService.getDepartements();
        setDepartements(data);
      } catch (error) {
        console.error("Erreur lors de la récupération des départements:", error);
      } finally {
        setLoading(false);
      }
    };
    loadDepartements();
  }, []);

  return (
    <Modal show={showForm} onHide={resetForm} animation={true} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editingUser ? "Modifier" : "Ajouter"} un Utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CIN *</Form.Label>
                <Form.Control
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              {!isNewUser && (
                <Form.Group className="mb-3">
                  <Form.Label>Matricule</Form.Label>
                  <Form.Control
                    type="text"
                    name="matricule"
                    value={formData.matricule}
                    readOnly
                  />
                </Form.Group>
              )}
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  readOnly={isNewUser}
                />
                {isNewUser && (
                  <Form.Text className="text-muted">
                    Généré automatiquement
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe {!editingUser && '*'}</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={!editingUser}
                />
                {editingUser && (
                  <Form.Text className="text-muted">
                    Laisser vide pour ne pas modifier
                  </Form.Text>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rôle *</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="employé">Employé</option>
                  <option value="validateur1">Validateur1 (Demandeuse)</option>
                  <option value="validateur2">Validateur2 (Structure d'Achats)</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Département</Form.Label>
                {loading ? (
                  <Form.Control type="text" disabled value="Chargement..." />
                ) : (
                  <Form.Select
                    name="departement_id"
                    value={formData.departement_id}
                    onChange={handleChange}
                    disabled={formData.role === "validateur2"}
                  >
                    <option value="">-- Sélectionner un département --</option>
                    {departements.map((departement) => (
                      <option key={departement.id} value={departement.id}>
                        {departement.nom}
                      </option>
                    ))}
                  </Form.Select>
                )}
                {formData.role === "validateur2" && (
                  <Form.Text className="text-muted">
                    Non applicable pour Validateur2
                  </Form.Text>
                )}
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Statut *</Form.Label>
                <Form.Select
                  name="statut_type"
                  value={formData.statut_type}
                  onChange={handleChange}
                  required
                >
                  <option value="ACTIF">ACTIF</option>
                  <option value="BLOQUE">BLOQUE</option>
                </Form.Select>
              </Form.Group>
            </div>
          </div>

          <div className="d-flex justify-content-end mt-3">
            <Button variant="secondary" onClick={resetForm} className="me-2">
              Annuler
            </Button>
            <Button type="submit" variant="primary">
              {editingUser ? "Modifier" : "Ajouter"}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default UserForm;