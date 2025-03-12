import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import UserForm from "../../components/UserForm";
import UserTable from "../../components/UserTable";
import { fetchUsers, createUser, updateUser, deleteUser } from "../../services/userService";

const GestionUser = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    cin: "",
    matricule: "",
    email: "",
    password: "",
    role: "employé",
    departement_id: "",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        setUsers(data);
      } catch (error) {
        console.error("Erreur:", error);
      }
    };
    loadUsers();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        await updateUser(editingUser.id, formData);
      } else {
        await createUser(formData);
      }
      const data = await fetchUsers();
      setUsers(data);
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      const data = await fetchUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleEdit = (user) => {
    setFormData({ ...user, departement_id: user.departement?.id || "" });
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
    });
    setEditingUser(null);
    setShowForm(false);
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Gestion des Utilisateurs</h2>
      <Button variant="primary" className="mb-3" onClick={() => { resetForm(); setShowForm(true); }}>
        + Ajouter un Utilisateur
      </Button>

      <UserForm showForm={showForm} handleSubmit={handleSubmit} handleChange={handleChange} formData={formData} resetForm={resetForm} editingUser={editingUser} />

      <UserTable users={users} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default GestionUser;
