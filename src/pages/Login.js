import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../services/authService';
import { Form, Button, Container, Card, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './Login.css'; 

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [statut_type] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const { token, role } = await login(email, password, statut_type);
      localStorage.setItem('userToken', token);
      localStorage.setItem('role', role);

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
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="login-container d-flex align-items-center justify-content-center min-vh-100">
      <Row className="w-100 justify-content-center">
        <Col xs={11} sm={8} md={6} lg={4}>
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <Card className="shadow rounded-4 p-4">
              <Card.Body>
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">GCT</h2>
                  <p className="text-muted">Groupe Chimique Tunisien - Demande d'Achats</p>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleLogin}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="utilisateur@gct.com.tn"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Mot de passe</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Votre mot de passe"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="rounded-3"
                    />
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 rounded-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />{' '}
                        Connexion...
                      </>
                    ) : (
                      'Se connecter'
                    )}
                  </Button>

                  <div className="text-center mt-3">
                    <Link to="/forgot-password" className="text-decoration-none">
                      Mot de passe oublié ?
                    </Link>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </motion.div>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
