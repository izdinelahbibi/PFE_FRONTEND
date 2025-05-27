// services/demandeAchatService.js
const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const fetchDemandesAValider = async () => {
  try {
    const response = await fetch(`${API_URL}/api/demandes/validation1`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la récupération des demandes');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans fetchDemandesAValider:', error);
    throw error;
  }
};

export const validerDemande = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/demandes/${id}/valider1`, {
      method: 'POST',
      headers: getAuthHeaders()
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors de la validation');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans validerDemande:', error);
    throw error;
  }
};

export const rejeterDemande = async (id, motif) => {
  try {
    const response = await fetch(`${API_URL}/api/demandes/${id}/rejeter1`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ motif })
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Erreur lors du rejet');
    }
    return await response.json();
  } catch (error) {
    console.error('Erreur dans rejeterDemande:', error);
    throw error;
  }
};

export const downloadFichierDemande = async (id) => {
  try {
    const response = await fetch(`${API_URL}/api/demandes/${id}/fichier`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('userToken')}`
      }
    });

    if (!response.ok) {
      throw new Error('Erreur lors du téléchargement');
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fichier_demande_${id}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Erreur dans downloadFichierDemande:', error);
    throw error;
  }
};


