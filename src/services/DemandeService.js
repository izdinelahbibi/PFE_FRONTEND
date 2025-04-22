const API_URL = process.env.REACT_APP_API_URL;

// Récupérer les informations de l'utilisateur connecté
export const fetchUserInfo = async (token) => {
  if (!token) {
    throw new Error("Token d'authentification manquant.");
  }

  try {
    const response = await fetch(`${API_URL}/api/utilisateur/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Impossible de récupérer les informations utilisateur.");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

// Récupérer les projets du département de l'utilisateur
export const fetchProjetsByDepartement = async (token, departementId) => {
  if (!token || !departementId) {
    throw new Error("Token ou ID du département manquant.");
  }

  try {
    const response = await fetch(`${API_URL}/api/projet/departement/${departementId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la récupération des projets.");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};

// Créer une demande d'achats avec fichier
export const createDemandeAchats = async (token, data) => {
  if (!token || !(data instanceof FormData)) {
    throw new Error("Token manquant ou données invalides.");
  }

  try {
    const response = await fetch(`${API_URL}/api/demandeachats`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: data,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Erreur lors de la création de la demande d'achats.");
    }

    return response.json();
  } catch (error) {
    throw error;
  }
};