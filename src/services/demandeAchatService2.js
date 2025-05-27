const API_URL = process.env.REACT_APP_API_URL;

const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Erreur lors de la requête');
  }
  return data;
};

export const getDemandesPourValidateur2 = async () => {
  const response = await fetch(`${API_URL}/api/demandes/validation2`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};

export const submitValidation2 = async (id, decision, motif = '') => {
  const endpoint = decision === 'Approuvé' 
    ? `${API_URL}/api/demandes/${id}/validation2` 
    : `${API_URL}/api/demandes/${id}/rejeter2`;
  
  const body = decision === 'Approuvé' 
    ? JSON.stringify({}) 
    : JSON.stringify({ motif });

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: getAuthHeaders(),
    body
  });
  return handleResponse(response);
};

// services/demandeAchatService2.js
export const downloadFile = async (filePath) => {
  if (!filePath) {
    throw new Error('Chemin du fichier non spécifié');
  }

  const encodedPath = encodeURIComponent(filePath);
  const response = await fetch(`${API_URL}/api/demandes/fichier/${encodedPath}`, {
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
  a.download = filePath.split('/').pop() || 'fichier_demande';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
};

export const getHistoriqueValidations = async () => {
  const response = await fetch(`${API_URL}/api/demandes/validateur2/historique`, {
    method: 'GET',
    headers: getAuthHeaders()
  });
  return handleResponse(response);
};