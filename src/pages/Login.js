import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import logo from '../assets/logo.jpg'; // Importez le logo ici
import './Login.css'; // Vous pouvez toujours utiliser votre fichier CSS personnalisé si nécessaire

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { token, role} = await login(email, password);
      localStorage.setItem('userToken', token);
      localStorage.setItem('role', role);
  
      // Rediriger en fonction du rôle
      if (role === 'admin') {
        navigate('/Dashboard');
      } else if (role === 'employé') {
        navigate('/EmployeDashboard');
      } else if (role === 'validateur') {
        navigate('/ValidateurDashboard');
      } else {
        throw new Error('Rôle non reconnu');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center vh-100">
      <Row>
        <Col md={6} className="d-flex align-items-center justify-content-center">
          <img
            src={logo}
            alt="Logo de la société"
            style={{ width: '200px', height: 'auto' }} // Ajustez la taille du logo
          />
        </Col>
        <Col md={6}>
          <Card style={{ width: '400px', padding: '20px' }}>
            <Card.Body>
              <Card.Title className="text-center">GCT</Card.Title>
              <Card.Subtitle className="mb-3 text-muted text-center">
                Groupe Chimique Tunisien - Demande D'Achats
              </Card.Subtitle>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleLogin}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Entrez votre email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Mot de passe</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Entrez votre mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Se connecter
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