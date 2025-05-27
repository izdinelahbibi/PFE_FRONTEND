const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeader = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur serveur');
  }
  return response.json();
};

// Fonctions pour récupérer les données
export const fetchStats = async () => {
  try {
    const [users, departements, rubriques] = await Promise.all([
      fetch(`${API_URL}/api/utilisateurs`, { headers: getAuthHeader() }).then(handleResponse),
      fetch(`${API_URL}/api/departements`, { headers: getAuthHeader() }).then(handleResponse),
      fetch(`${API_URL}/api/rubriques`, { headers: getAuthHeader() }).then(handleResponse)
    ]);

    return {
      users: processUsers(users),
      departements: processDepartements(departements),
      rubriques: processRubriques(rubriques)
    };
  } catch (error) {
    throw new Error('Erreur lors du chargement des statistiques: ' + error.message);
  }
};

// Fonctions de traitement des données
const processUsers = (users) => {
  const roleData = users.reduce((acc, user) => {
    acc[user.role] = (acc[user.role] || 0) + 1;
    return acc;
  }, {});

  const statusData = users.reduce((acc, user) => {
    acc[user.statut_type] = (acc[user.statut_type] || 0) + 1;
    return acc;
  }, {});

  return {
    total: users.length,
    roleData: Object.entries(roleData).map(([name, value]) => ({ name, value })),
    statusData: Object.entries(statusData).map(([name, value]) => ({ name, value })),
    recentUsers: [...users]
      .sort((a, b) => new Date(b.dateCreation) - new Date(a.dateCreation))
      .slice(0, 5)
  };
};

const processDepartements = (departements) => ({
  total: departements.length,
  list: departements
});

const processRubriques = (rubriques) => ({
  total: rubriques.length,
  data: rubriques.map(rub => ({ name: rub.nom, value: 1 })),
  recentRubriques: [...rubriques]
    .sort((a, b) => new Date(b.date_creation) - new Date(a.date_creation))
    .slice(0, 5)
});