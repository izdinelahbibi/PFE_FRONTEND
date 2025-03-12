// services/ProjetService.js

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Récupère tous les projets (pour l'administrateur)
 * @param {string} token - Le token d'authentification de l'utilisateur
 * @returns {Promise<Array>} - Une liste de projets
 */
export const fetchAllProjets = async (token) => {
  try {
    const response = await fetch(`${API_URL}/api/projets`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des projets');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur dans fetchAllProjets:', error);
    throw error;
  }
};

/**
 * Ajoute un nouveau projet
 * @param {string} token - Le token d'authentification de l'utilisateur
 * @param {Object} projet - Les données du projet à ajouter
 * @returns {Promise<Object>} - Le projet ajouté
 */
export const addProjet = async (token, projet) => {
  try {
    const response = await fetch(`${API_URL}/projets`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(projet),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du projet');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur dans addProjet:', error);
    throw error;
  }
};

