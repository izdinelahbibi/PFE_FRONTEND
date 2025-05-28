import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container, Card, Alert, Spinner } from 'react-bootstrap';
import { sendPasswordRequest } from '../services/authService';
import { motion } from 'framer-motion';
import './Forgot.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await sendPasswordRequest(email, description);
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        navigate('/login');
      }, 3000); // Hide success message after 3 seconds and redirect
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container fluid className="forgot-password-container d-flex justify-content-center align-items-center min-vh-100">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-100 d-flex justify-content-center"
      >
        <Card className="shadow rounded-4 p-4" style={{ maxWidth: '450px', width: '100%' }}>
          <Card.Body>
            <div className="text-center mb-4">
              <h3 className="fw-bold text-primary">Réinitialiser le mot de passe</h3>
              <p className="text-muted">Expliquez brièvement votre problème</p>
            </div>

            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
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
                <Form.Label>Description du problème</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Décrivez brièvement votre situation..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="rounded-3"
                />
              </Form.Group>

              <Button type="submit" variant="primary" disabled={isLoading} className="w-100 rounded-3">
                {isLoading ? (
                  <>
                    <Spinner animation="border" size="sm" role="status" /> Envoi...
                  </>
                ) : (
                  'Envoyer'
                )}
              </Button>
            </Form>

            <div className="text-center mt-3">
              <Link to="/login" className="text-decoration-none">← Retour à la connexion</Link>
            </div>
          </Card.Body>
        </Card>
      </motion.div>

      {showSuccess && (
        <motion.div
          className="success-overlay"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.5 }}
        >
          <div className="success-message">
            <div className="success-icon">✔</div>
            <h4>Demande envoyée avec succès !</h4>
            <p>Votre demande a été enregistrée auprès de l'administrateur.</p>
            <p>Vous serez redirigé vers la page de connexion...</p>
          </div>
        </motion.div>
      )}
    </Container>
  );
};

export default ForgotPassword;