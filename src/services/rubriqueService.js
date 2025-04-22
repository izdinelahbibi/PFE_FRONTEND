const API_URL = `${process.env.REACT_APP_API_URL}/api/rubriques`;

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

export const fetchRubriques = async () => {
  try {
    const response = await fetch(API_URL, {
      headers: getAuthHeader()
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Erreur réseau: ' + error.message);
  }
};

export const createRubrique = async (rubriqueData) => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify(rubriqueData)
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Erreur lors de la création: ' + error.message);
  }
};

export const updateRubrique = async (id, rubriqueData) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'PUT',
      headers: getAuthHeader(),
      body: JSON.stringify(rubriqueData)
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Erreur lors de la mise à jour: ' + error.message);
  }
};

export const deleteRubrique = async (id) => {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  } catch (error) {
    throw new Error('Erreur lors de la suppression: ' + error.message);
  }
};