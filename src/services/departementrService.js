// services/departementService.js
const API_URL = `${process.env.REACT_APP_API_URL}/api/departements`;

const getAuthHeader = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export const fetchDepartements = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeader()
    });
    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des départements');
    }
    return response.json();
  } catch (error) {
    throw new Error('Erreur réseau: ' + error.message);
  }
};  