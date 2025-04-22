const API_URL = process.env.REACT_APP_API_URL;

const fetchWithAuth = async (url, options = {}) => {
  const token = localStorage.getItem('userToken');
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(`${API_URL}${url}`, { ...options, headers });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Erreur lors de la requête');
  }

  return response.json();
};

export const getDemandesPourValidateur2 = async () => {
  return fetchWithAuth('/api/demandes/validateur2');
};

export const submitValidation2 = async (demandeId, decision, motif) => {
  return fetchWithAuth(`/api/demandes/${demandeId}/validation2`, {
    method: 'PUT',
    body: JSON.stringify({ decision, motif }),
  });
};