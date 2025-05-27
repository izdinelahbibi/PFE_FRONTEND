const API_URL = process.env.REACT_APP_API_URL;

const fetchUserInfo = async (token) => {
  const response = await fetch(`${API_URL}/api/utilisateur/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des informations utilisateur');
  }

  return response.json();
};

const fetchProjetsByDepartement = async (token, departementId) => {
  const response = await fetch(`${API_URL}/api/projet/departement/${departementId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des projets');
  }

  return response.json();
};

export const fetchRubriques = async (token) => {
  const response = await fetch(`${API_URL}/api/rubriques`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des rubriques');
  }
  
  return await response.json();
};

export const addProjet = async (token, projetData) => {
  const response = await fetch(`${API_URL}/api/projet`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      ...projetData,
      rubrique_id: projetData.rubrique_id || null
    })
  });
  return await response.json();
};

const addPlanningAnnuel = async (token, planningData) => {
  const response = await fetch(`${API_URL}/api/planningannuel`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(planningData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de l'ajout du planning annuel");
  }

  return response.json();
};

const fetchDepensesByProjet = async (token, projetId) => {
  const response = await fetch(`${API_URL}/api/projet/${projetId}/depenses`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la récupération des dépenses");
  }

  return response.json();
};

export const updateProjet = async (token, projetId, projetData) => {
  const response = await fetch(`${API_URL}/api/projet/${projetId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(projetData)
  });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la mise à jour du projet");
  }
  
  return await response.json();
};

export const fetchBudgetDetails = async (token, projetId) => {
  const response = await fetch(`${API_URL}/api/projet/${projetId}/budget`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Erreur lors de la récupération des détails budgétaires");
  }

  return response.json();
};

export { 
  fetchUserInfo, 
  fetchProjetsByDepartement,  
  addPlanningAnnuel, 
  fetchDepensesByProjet 
};