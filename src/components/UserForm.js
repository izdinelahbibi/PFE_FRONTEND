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
  const [errors, setErrors] = useState({}); // State to store validation errors

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

  // Validation function for individual field (used for real-time validation)
  const validateField = (name, value) => {
    const newErrors = { ...errors };

    // Helper function to check if value is empty or only whitespace
    const isEmptyOrWhitespace = (val) => !val || !val.trim();

    // Helper function to validate letters, spaces, and hyphens
    const isValidName = (val) => /^[a-zA-Z\s-]{2,}$/.test(val.trim());

    switch (name) {
      case "nom":
      case "prenom":
        if (isEmptyOrWhitespace(value)) {
          newErrors[name] = `${name === "nom" ? "Nom" : "Prénom"} ne peut pas être vide ou contenir uniquement des espaces.`;
        } else if (!isValidName(value)) {
          newErrors[name] = `${name === "nom" ? "Nom" : "Prénom"} doit contenir au moins 2 lettres (seules les lettres, espaces ou tirets sont autorisés).`;
        } else {
          delete newErrors[name];
        }
        break;
      case "cin":
        if (isEmptyOrWhitespace(value)) {
          newErrors.cin = "CIN ne peut pas être vide ou contenir uniquement des espaces.";
        } else if (!/^\d{8}$/.test(value.trim())) {
          newErrors.cin = "Le CIN doit contenir exactement 8 chiffres.";
        } else {
          delete newErrors.cin;
        }
        break;
      case "email":
        if (isEmptyOrWhitespace(value)) {
          newErrors.email = "Email ne peut pas être vide ou contenir uniquement des espaces.";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
          newErrors.email = "L'email n'est pas valide.";
        } else {
          delete newErrors.email;
        }
        break;
      case "password":
        if (!editingUser && isEmptyOrWhitespace(value)) {
          newErrors.password = "Mot de passe ne peut pas être vide ou contenir uniquement des espaces.";
        } else if (!editingUser && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(value)) {
          newErrors.password = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
        } else {
          delete newErrors.password;
        }
        break;
      case "role":
        if (isEmptyOrWhitespace(value)) {
          newErrors.role = "Rôle ne peut pas être vide.";
        } else {
          delete newErrors.role;
        }
        break;
      case "statut_type":
        if (isEmptyOrWhitespace(value)) {
          newErrors.statut_type = "Statut ne peut pas être vide.";
        } else {
          delete newErrors.statut_type;
        }
        break;
      case "departement_id":
        if (formData.role !== "validateur2" && isEmptyOrWhitespace(value)) {
          newErrors.departement_id = "Département doit être sélectionné (sauf pour Validateur2).";
        } else {
          delete newErrors.departement_id;
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input change with real-time validation
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    handleChange(e); // Call parent handleChange to update formData
    validateField(name, value); // Validate the changed field
  };

  // Validation function for form submission
  const validateForm = () => {
    const newErrors = {};

    // List of required fields
    const requiredFields = [
      { key: "nom", label: "Nom" },
      { key: "prenom", label: "Prénom" },
      { key: "cin", label: "CIN" },
      { key: "email", label: "Email" },
      { key: "role", label: "Rôle" },
      { key: "statut_type", label: "Statut" },
    ];

    // If creating a new user, password is required
    if (!editingUser) {
      requiredFields.push({ key: "password", label: "Mot de passe" });
    }

    // Validate all required fields
    requiredFields.forEach(({ key, label }) => {
      const value = formData[key]?.trim();
      if (!value) {
        newErrors[key] = `${label} ne peut pas être vide ou contenir uniquement des espaces.`;
      }
    });

    // Additional validation for nom and prenom
    if (formData.nom && !/^[a-zA-Z\s-]{2,}$/.test(formData.nom.trim())) {
      newErrors.nom = "Nom doit contenir au moins 2 lettres (seules les lettres, espaces ou tirets sont autorisés).";
    }
    if (formData.prenom && !/^[a-zA-Z\s-]{2,}$/.test(formData.prenom.trim())) {
      newErrors.prenom = "Prénom doit contenir au moins 2 lettres (seules les lettres, espaces ou tirets sont autorisés).";
    }

    // Additional validation for CIN
    if (formData.cin && !/^\d{8}$/.test(formData.cin.trim())) {
      newErrors.cin = "Le CIN doit contenir exactement 8 chiffres.";
    }

    // Additional validation for email
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "L'email n'est pas valide.";
    }

    // Additional validation for password (for new users)
    if (!editingUser && formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(formData.password)) {
      newErrors.password = "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.";
    }

    // Additional validation for departement_id (required unless role is validateur2)
    if (formData.role !== "validateur2" && !formData.departement_id) {
      newErrors.departement_id = "Département doit être sélectionné (sauf pour Validateur2).";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Return true if no errors
  };

  // Handle form submission
  const onSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleSubmit(e); // Call the parent handleSubmit only if validation passes
    }
  };

  return (
    <Modal show={showForm} onHide={resetForm} animation={true} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>{editingUser ? "Modifier" : "Ajouter"} un Utilisateur</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <div className="row">
            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Nom *</Form.Label>
                <Form.Control
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.nom}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s-]/g, ""); // Allow only letters, spaces, and hyphens
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.nom}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Prénom *</Form.Label>
                <Form.Control
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.prenom}
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^a-zA-Z\s-]/g, ""); // Allow only letters, spaces, and hyphens
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.prenom}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>CIN *</Form.Label>
                <Form.Control
                  type="text"
                  name="cin"
                  value={formData.cin}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.cin}
                  maxLength="8"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/[^0-9]/g, ""); // Allow only digits
                  }}
                />
                <Form.Control.Feedback type="invalid">{errors.cin}</Form.Control.Feedback>
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
                  onChange={handleInputChange}
                  required
                  readOnly={isNewUser}
                  isInvalid={!!errors.email}
                />
                {isNewUser && (
                  <Form.Text className="text-muted">
                    Généré automatiquement
                  </Form.Text>
                )}
                <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Mot de passe {!editingUser && '*'}</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required={!editingUser}
                  isInvalid={!!errors.password}
                />
                {editingUser && (
                  <Form.Text className="text-muted">
                    Laisser vide pour ne pas modifier
                  </Form.Text>
                )}
                <Form.Control.Feedback type="invalid">{errors.password}</Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Rôle *</Form.Label>
                <Form.Select
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.role}
                >
                  <option value="">-- Sélectionner un rôle --</option>
                  <option value="employé">Employé</option>
                  <option value="validateur1">Validateur1 (Demandeuse)</option>
                  <option value="validateur2">Validateur2 (Structure d'Achats)</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.role}</Form.Control.Feedback>
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
                    onChange={handleInputChange}
                    disabled={formData.role === "validateur2"}
                    isInvalid={!!errors.departement_id}
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
                <Form.Control.Feedback type="invalid">{errors.departement_id}</Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="col-md-6">
              <Form.Group className="mb-3">
                <Form.Label>Statut *</Form.Label>
                <Form.Select
                  name="statut_type"
                  value={formData.statut_type}
                  onChange={handleInputChange}
                  required
                  isInvalid={!!errors.statut_type}
                >
                  <option value="">-- Sélectionner un statut --</option>
                  <option value="ACTIF">ACTIF</option>
                  <option value="BLOQUE">BLOQUE</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">{errors.statut_type}</Form.Control.Feedback>
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