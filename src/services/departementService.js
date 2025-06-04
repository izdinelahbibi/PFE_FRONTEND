const API_URL = `${process.env.REACT_APP_API_URL}/api/departements`;

// Fonction pour ajouter un département
const addDepartement = async (nom, description) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, description }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de l\'ajout du département');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de l\'ajout du département :', error);
    throw error;
  }
};

// Fonction pour récupérer tous les départements
const getDepartements = async () => {
  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des départements');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la récupération des départements :', error);
    throw error;
  }
};

// Fonction pour mettre à jour un département
const updateDepartement = async (id, nom, description) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nom, description }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la modification du département');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur lors de la modification du département :', error);
    throw error;
  }
};



// Exportez les fonctions sous forme d'objet
const departementService = {
  addDepartement,
  getDepartements,
  updateDepartement,
  
};

export default departementService;