


export const login = async (email, password) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    let errorMessage = 'Email ou mot de passe incorrect';
    try {
      const errorData = await response.json();
      // Si le message d'erreur est lié au statut de l'utilisateur
      errorMessage = errorData.message || errorMessage;
    } catch (err) {
      const errorText = await response.text();
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // Vérifier que la réponse est bien au format JSON
  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    throw new Error('Réponse du serveur invalide');
  }

  const data = await response.json();

  // Vérifier que la réponse contient un token et un rôle
  if (!data.token || !data.role) {
    throw new Error('Réponse du serveur incomplète');
  }

  return data; // Retourne { token, role }
};

export const sendPasswordRequest = async (email, description) => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/password-requests`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, description }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
};