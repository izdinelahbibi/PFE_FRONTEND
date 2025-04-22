import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import './Login.css'; // Fichier CSS personnalisé si nécessaire

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statut_type] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Ajout d'un état de chargement
  const navigate = useNavigate();

  // Empêcher la navigation arrière
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Réinitialiser l'erreur avant chaque tentative de connexion
    setIsLoading(true); // Activer l'état de chargement
  
    try {
      // Appeler le service de connexion
      const { token, role } = await login(email, password, statut_type);
  
      // Stocker le token et le rôle dans le localStorage
      localStorage.setItem('userToken', token);
      localStorage.setItem('role', role);
  
      // Rediriger en fonction du rôle
      switch (role) {
        case 'admin':
          navigate('/Dashboard');
          break;
        case 'employé':
          navigate('/EmployeDashboard');
          break;
        case 'validateur1':
          navigate('/ValidateurDashboard');
          break;
          case 'validateur2':
            navigate('/Validateur2Dashboard');
            break;
        default:
          throw new Error('Rôle non reconnu');
      }
    } catch (err) {
      setError(err.message || 'Une erreur s\'est produite lors de la connexion');
    } finally {
      setIsLoading(false); // Désactiver l'état de chargement
    }
  };
  
  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
      

        <Col md={6}>
          <Card style={{ width: '400px', padding: '20px', marginLeft: '50%', marginBottom:'30%' }}>
            <Card.Body>
              <Card.Title className="text-center">GCT</Card.Title>
              <Card.Subtitle className="mb-3 text-muted text-center">
                Groupe Chimique Tunisien - Demande D'Achats
              </Card.Subtitle>

              {/* Affichage des erreurs */}
              {error && <Alert variant="danger">{error}</Alert>}

              {/* Formulaire de connexion */}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required // Champ obligatoire
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required // Champ obligatoire
                  />
                </Form.Group>

                {/* Bouton de connexion avec état de chargement */}
                <Button variant="primary" type="submit" className="w-100" disabled={isLoading}>
                  {isLoading ? 'Connexion en cours...' : 'Se connecter'}
                </Button>

                {/* Lien mot de passe oublié */}
                <div className="text-center mt-3">
                  <a href="/forgot-password" className="text-decoration-none">
                    Mot de passe oublié ?
                  </a>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;