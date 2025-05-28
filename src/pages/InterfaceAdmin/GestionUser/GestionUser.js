import React, { useState, useEffect } from "react";
import { Button, FormControl, InputGroup } from "react-bootstrap";
import UserForm from "../../../components/UserForm";
import UserTable from "../../../components/UserTable";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../../services/userService";

const GestionUser = ({ isSidebarOpen }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);
  const [nextMatricule, setNextMatricule] = useState(1001);
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    matricule: "",
    email: "",
    password: "",
    role: "employé",
    departement_id: "",
    statut_type: "ACTIF",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
        setFilteredUsers(data);
        
        if (data.length > 0) {
          const maxMatricule = Math.max(...data.map(user => parseInt(user.matricule) || 0));
          setNextMatricule(maxMatricule >= 1001 ? maxMatricule + 1 : 1001);
        } else {
          setNextMatricule(1001);
        }
      } catch (error) {
        console.error("Erreur:", error);
        setError("Erreur lors du chargement des utilisateurs");
      }
    };
    loadUsers();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredUsers(users);
    } else {
      const filtered = users.filter(user => 
        user.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.matricule.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.cin.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredUsers(filtered);
    }
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFormData = { ...formData, [name]: value };

    // Si le rôle change à validateur2, on vide le département
    if (name === 'role' && value === 'validateur2') {
      newFormData.departement_id = "";
    }

    // Génération automatique de l'email
    if ((name === 'prenom' || name === 'nom') && !editingUser) {
      const prenom = name === 'prenom' ? value : formData.prenom;
      const nom = name === 'nom' ? value : formData.nom;
      
      if (prenom && nom) {
        const cleanPrenom = prenom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        const cleanNom = nom.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
        newFormData.email = `${cleanPrenom}.${cleanNom}@gct.com.tn`;
      }
    }

    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      // Validation des champs obligatoires
      if (!formData.nom || !formData.prenom || !formData.email || !formData.cin || !formData.role || !formData.statut_type) {
        throw new Error("Les champs nom, prénom, email, CIN, rôle et statut sont obligatoires");
      }

      // Validation spécifique pour validateur1
      if (formData.role === 'validateur1' && !formData.departement_id) {
        throw new Error("Un département doit être sélectionné pour un validateur1");
      }

      // Validation pour validateur2
      if (formData.role === 'validateur2' && formData.departement_id) {
        throw new Error("Aucun département ne doit être sélectionné pour un validateur2");
      }

      if (!editingUser && !formData.password) {
        throw new Error("Le mot de passe est obligatoire pour la création");
      }

      let userData = { ...formData };

      if (editingUser) {
        if (!userData.password) {
          delete userData.password;
        }
        await updateUser(editingUser.id, userData);
      } else {
        userData.matricule = nextMatricule.toString();
        await createUser(userData);
        setNextMatricule(nextMatricule + 1);
      }

      const data = await fetchUsers();
      setUsers(data);
      resetForm();
    } catch (error) {
      console.error("Erreur soumission:", error);
      setError(error.message || "Erreur lors de la création/mise à jour de l'utilisateur");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      try {
        await deleteUser(id);
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Erreur:", error);
        setError("Erreur lors de la suppression de l'utilisateur");
      }
    }
  };

  const handleEdit = (user) => {
    setFormData({ 
      ...user, 
      departement_id: user.departement_id || "",
      password: ""
    });
    setEditingUser(user);
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      nom: "",
      prenom: "",
      cin: "",
      matricule: "",
      email: "",
      password: "",
      role: "employé",
      departement_id: "",
      statut_type: "ACTIF",
    });
    setEditingUser(null);
    setShowForm(false);
    setError(null);
  };

  const containerStyle = {
    marginLeft: isSidebarOpen ? '250px' : '78px',
    padding: '20px',
    transition: 'margin-left 0.5s ease',
  };

  return (
    <div style={containerStyle}>
      <h2 className="mb-4">Gestion des Utilisateurs</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="d-flex justify-content-between mb-3">
        <Button variant="primary" onClick={() => { resetForm(); setShowForm(true); }}>
          + Ajouter un Utilisateur
        </Button>
        
        <InputGroup style={{ width: '300px' }}>
          <FormControl
            placeholder="Rechercher un utilisateur..."
            aria-label="Rechercher"
            value={searchTerm}
            onChange={handleSearchChange}
          />
          <InputGroup.Text>
            <i className="bi bi-search"></i>
          </InputGroup.Text>
        </InputGroup>
      </div>

      <UserForm 
        showForm={showForm} 
        handleSubmit={handleSubmit} 
        handleChange={handleChange} 
        formData={formData} 
        resetForm={resetForm} 
        editingUser={editingUser} 
        isNewUser={!editingUser}
      />

      <UserTable users={filteredUsers} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default GestionUser;