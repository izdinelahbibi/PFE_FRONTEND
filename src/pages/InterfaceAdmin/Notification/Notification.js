import React, { useEffect, useState } from 'react';
import { Table, Spinner, Alert, Card, Container, Badge, Button } from 'react-bootstrap';
import './notifications.css';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchNotificationsFromAPI();

      if (!data || !Array.isArray(data)) {
        throw new Error('Réponse invalide du serveur');
      }

      setNotifications(data);
      setSuccess('Notifications chargées avec succès');
    } catch (err) {
      console.error('Erreur:', err);
      setError(err.message || 'Erreur lors du chargement des notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour');
      }

      setNotifications(prev => prev.map(notif =>
        notif.id === notificationId ? { ...notif, is_read: true } : notif
      ));
      setSuccess('Notification marquée comme lue');
    } catch (err) {
      setError(err.message);
    }
  };

  const markAllAsRead = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/notifications/read-all`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Échec de la mise à jour');
      }

      setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
      setSuccess('Toutes les notifications marquées comme lues');
    } catch (err) {
      setError(err.message);
    }
  };

  const getBadgeVariant = (type) => {
    switch ((type || '').toLowerCase()) {
      case 'warning': return 'warning';
      case 'error': return 'danger';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'secondary';
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

  const unreadCount = notifications.filter(notif => !notif.is_read).length;
  const totalCount = notifications.length;

  return (
    <Container className="mt-4">
      <Card className="notifications-card">
        <Card.Header className="notifications-header">
          <span>Notifications</span>
          <div>
            {totalCount > 0 && (
              <Badge bg="primary" pill className="me-2">
                {totalCount}
              </Badge>
            )}
            {unreadCount > 0 && (
              <Badge bg="danger" pill>
                {unreadCount} non lues
              </Badge>
            )}
          </div>
        </Card.Header>

        <Card.Body>
          {error && (
            <Alert variant="danger" onClose={() => setError(null)} dismissible>
              <Alert.Heading>Erreur</Alert.Heading>
              <p>{error}</p>
            </Alert>
          )}

          {success && (
            <Alert variant="success" onClose={() => setSuccess(null)} dismissible>
              <p>{success}</p>
            </Alert>
          )}

          {unreadCount > 0 && (
            <div className="mb-3 d-flex justify-content-end">
              <Button variant="outline-primary" size="sm" onClick={markAllAsRead}>
                Tout marquer comme lu
              </Button>
            </div>
          )}

          {totalCount > 0 ? (
            <Table striped bordered hover responsive>
              <thead className="table-dark">
                <tr>
                  <th>Email</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>État</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {notifications.map((notif) => (
                  <tr key={notif.id || notif._id} className={!notif.is_read ? 'fw-bold' : ''}>
                    <td>{notif.email || 'N/A'}</td>
                    <td>{notif.description || 'Aucune description'}</td>
                    <td>
                      <Badge bg={getBadgeVariant(notif.type)}>
                        {notif.type || 'Non spécifié'}
                      </Badge>
                    </td>
                    <td>
                      {notif.created_at ? new Date(notif.created_at).toLocaleString() : 'Date inconnue'}
                    </td>
                    <td>
                      {notif.is_read ? (
                        <Badge bg="secondary">Lue</Badge>
                      ) : (
                        <Badge bg="success">Nouvelle</Badge>
                      )}
                    </td>
                    <td>
                      {!notif.is_read ? (
                        <Button
                          variant="outline-success"
                          size="sm"
                          onClick={() => markAsRead(notif.id)}
                          title="Marquer comme lu"
                        >
                          ✓
                        </Button>
                      ) : (
                        <span className="text-muted">✓ Lu</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
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
  try {
    const apiUrl = process.env.REACT_APP_API_URL;
    if (!apiUrl) {
      throw new Error('URL API non configurée');
    }

    const response = await fetch(`${apiUrl}/api/notifications`);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Erreur HTTP: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error('Format de données invalide: tableau attendu');
    }

    return data;
  } catch (error) {
    console.error('Erreur dans fetchNotificationsFromAPI:', error);
    throw error;
  }
};

export default Notifications;