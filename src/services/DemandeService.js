
const API_URL = process.env.REACT_APP_API_URL;

// Récupérer les informations de l'utilisateur connecté
export const fetchUserInfo = async (token) => {
  const response = await fetch(`${API_URL}/api/utilisateur/me`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des informations utilisateur');
  }

  return response.json();
};

// Récupérer les projets du département de l'utilisateur
export const fetchProjetsByDepartement = async (token, departementId) => {
  const response = await fetch(`${API_URL}/api/projet/departement/${departementId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des projets');
  }

  return response.json();
};

// Créer une demande d'achats
export const createDemandeAchats = async (token, data) => {
  const response = await fetch(`${API_URL}/api/demandeachats`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la création de la demande d\'achats');
  }

  return response.json();
};