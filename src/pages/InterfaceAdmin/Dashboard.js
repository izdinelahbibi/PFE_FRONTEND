import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import GestionUser from './GestionUser';
import GestionDepartement from './GestionDepartement'; // Importez le nouveau composant
import Projet from './Projet';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('welcome');
  const navigate = useNavigate();

  useEffect(() => {
    // Empêcher la navigation arrière
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href);
    };
  }, []);

  const handleLogout = () => {
    console.log('Déconnexion en cours...');
    localStorage.removeItem('userToken'); // Supprime le token (si utilisé)
    navigate('/login'); // Redirige vers la page de connexion
  };

  const renderComponent = () => {
    switch (activeComponent) {
      case 'users':
        default:  
        return <GestionUser />;
      case 'departements':
        return <GestionDepartement />; 
        case 'Projets':
          return <Projet />; 
    }
  };

  return (
    <div style={styles.container}>
      <Navbar onLogout={handleLogout} />
      <div style={styles.dashboard}>
        <div style={styles.sidebar}>
          <ul style={styles.sidebarList}>
            <li style={styles.sidebarItem} onClick={() => setActiveComponent('welcome')}>
            Statistique
            </li>
            <li style={styles.sidebarItem} onClick={() => setActiveComponent('users')}>
              Ajouter/Modifier des utilisateurs 
            </li>
            <li style={styles.sidebarItem} onClick={() => setActiveComponent('departements')}>
              Ajouter des départements 
            </li>
            <li style={styles.sidebarItem} onClick={() => setActiveComponent('Projets')}>
              Projets
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
    backgroundColor: '#f4f4f4',
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
  sidebarList: {
    listStyleType: 'none',
    padding: 0,
  },
  sidebarItem: {
    margin: '20px 0',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};

export default Dashboard;