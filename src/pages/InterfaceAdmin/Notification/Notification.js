import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Card, Container, Badge } from 'react-bootstrap';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data = await fetchNotificationsFromAPI();
        setNotifications(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getBadgeVariant = (type) => {
    switch (type.toLowerCase()) {
      case 'warning':
        return 'warning';
      case 'error':
        return 'danger';
      case 'info':
        return 'info';
      case 'success':
        return 'success';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Container className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Chargement...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          <Alert.Heading>Erreur</Alert.Heading>
          <p>{error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header as="h5" className="d-flex justify-content-between align-items-center">
          <span>Notifications</span>
          <Badge bg="primary" pill>
            {notifications.length}
          </Badge>
        </Card.Header>
        <Card.Body>
          <Table striped bordered hover responsive>
            <thead className="table-dark">
              <tr>
                <th>Email</th>
                <th>Description</th>
                <th>Type</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((notif) => (
                <tr key={notif.id}>
                  <td>{notif.email}</td>
                  <td>{notif.description}</td>
                  <td>
                    <Badge bg={getBadgeVariant(notif.type)}>{notif.type}</Badge>
                  </td>
                  <td>{new Date(notif.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </Table>
          {notifications.length === 0 && (
            <Alert variant="info" className="text-center">
              Aucune notification disponible
            </Alert>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

const fetchNotificationsFromAPI = async () => {
  const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications`);
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Erreur lors de la récupération des notifications');
  }
  return response.json();
};

export default Notifications;