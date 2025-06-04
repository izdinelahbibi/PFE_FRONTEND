// src/services/demandeAchatService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Récupère les informations de l'utilisateur connecté
 * @param {string} token - JWT token d'authentification
 * @returns {Promise<Object>} - Informations de l'utilisateur
 */
export const fetchUserInfo = async (token) => {
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

/**
 * Récupère les demandes rejetées par département
 * @param {number} departmentId - ID du département
 * @returns {Promise<Object>} - Liste des demandes rejetées
 */
export const fetchRejectedDemandesByDepartment = async (departmentId) => {
  const token = localStorage.getItem('userToken');
  if (!token) {
    throw new Error('Utilisateur non connecté');
  }

  const response = await fetch(`${API_URL}/api/demandeachats/departement/${departmentId}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Erreur lors de la récupération des demandes rejetées');
  }

  return await response.json();
};

const demandeAchatService = {
  fetchUserInfo,
  fetchRejectedDemandesByDepartment,
};

export default demandeAchatService;