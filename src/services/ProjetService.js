
const API_URL = process.env.REACT_APP_API_URL;

// Récupérer les informations de l'utilisateur connecté
const fetchUserInfo = async (token) => {
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

// Récupérer les projets par département
const fetchProjetsByDepartement = async (token, departementId) => {
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

// Ajouter un nouveau projet
const addProjet = async (token, projetData) => {
  const response = await fetch(`${API_URL}/api/projet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(projetData),
  });

  if (!response.ok) {
    throw new Error("Erreur lors de l'ajout du projet");
  }

  return response.json();
};

export { fetchUserInfo, fetchProjetsByDepartement, addProjet };

