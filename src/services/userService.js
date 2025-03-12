// services/userService.js


export const fetchUsers = async () => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/utilisateurs`);
    if (!response.ok) throw new Error("Erreur lors du chargement des utilisateurs");
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const createUser = async (userData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/utilisateurs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Erreur lors de la création de l'utilisateur");
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const updateUser = async (id, userData) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/utilisateurs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error("Erreur lors de la mise à jour de l'utilisateur");
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};

export const deleteUser = async (id) => {
  try {
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/utilisateurs/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression de l'utilisateur");
    return await response.json();
  } catch (error) {
    console.error("Erreur:", error);
    throw error;
  }
};