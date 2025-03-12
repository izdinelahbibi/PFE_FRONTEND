import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Projet from './Projet';
import DemandeAchats from './DemandeAchats';
import ConsulterDemande from './Consulterdemande';
import Profil from './Profil';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('welcome');
  const [activeItem, setActiveItem] = useState('welcome');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      navigate('/login');
      return;
    }

    // Empêcher la navigation arrière
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, [navigate]);

  const handleLogout = () => {
    console.log('Déconnexion en cours...');
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const handleSidebarClick = (component) => {
    setActiveComponent(component);
    setActiveItem(component);
  };

  const renderComponent = () => {
    if (loading) {
      return <div className="text-center mt-5">Chargement en cours...</div>;
    }

    if (error) {
      return <div className="alert alert-danger text-center mt-5">Erreur: {error}</div>;
    }

    switch (activeComponent) {
      default:
      case 'projet':
        return <Projet setLoading={setLoading} setError={setError} />;
      case 'demandeachats':
        return <DemandeAchats setLoading={setLoading} setError={setError} />;
      case 'consulterdemande':
        return <ConsulterDemande setLoading={setLoading} setError={setError} />;
        case 'profil':
          return <Profil setLoading={setLoading} setError={setError} />;
     
    }
  };

  return (
    <div style={styles.container}>
      <Navbar onLogout={handleLogout} />
      <div style={styles.dashboard}>
        <div style={styles.sidebar}>
          <ul style={styles.sidebarList}>
            <li
              style={{
                ...styles.sidebarItem,
                backgroundColor: activeItem === 'projet' ? '#ddd' : '#f8f9fa',
              }}
              onClick={() => handleSidebarClick('projet')}
            >
              Projet
            </li>
            <li
              style={{
                ...styles.sidebarItem,
                backgroundColor: activeItem === 'demandeachats' ? '#ddd' : '#f8f9fa',
              }}
              onClick={() => handleSidebarClick('demandeachats')}
            >
              Demande d'achats
            </li>
            <li
              style={{
                ...styles.sidebarItem,
                backgroundColor: activeItem === 'consulterdemande' ? '#ddd' : '#f8f9fa',
              }}
              onClick={() => handleSidebarClick('consulterdemande')}
            >
              Consulter Demandes
            </li>
            <li
              style={{
                ...styles.sidebarItem,
                backgroundColor: activeItem === 'profil' ? '#ddd' : '#f8f9fa',
              }}
              onClick={() => handleSidebarClick('profil')}
            >
             Profil
            </li>
          </ul>
        </div>
        <div style={styles.mainContent}>{renderComponent()}</div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative',
  },
  dashboard: {
    flex: 1,
    display: 'flex',
    overflow: 'hidden',
  },
  sidebar: {
    width: '250px',
    backgroundColor: '#f8f9fa',
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    borderRight: '1px solid #dee2e6',
  },
  sidebarList: {
    listStyleType: 'none',
    padding: 0,
  },
  sidebarItem: {
    margin: '10px 0',
    cursor: 'pointer',
    fontWeight: 'bold',
    padding: '10px',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
    backgroundColor: '#fff',
  },
};

export default EmployeDashboard;