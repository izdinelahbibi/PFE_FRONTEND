import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar';
import GestionUser from './GestionUser/GestionUser';
import GestionDepartement from './GestionDep/GestionDepartement';
import GestionRubrique from './GestionRubrique/GestionRubrique';
import Profil from './Profil/Profil';

const Dashboard = () => {
  const [activeComponent, setActiveComponent] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // État pour la Sidebar
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
      default:
      case 'users':
        return <GestionUser  isSidebarOpen={isSidebarOpen} />;
      case 'departements':
        return <GestionDepartement isSidebarOpen={isSidebarOpen} />;
        case 'rubriques':
  return <GestionRubrique isSidebarOpen={isSidebarOpen} />;
        case 'Profil':
        return <Profil  isSidebarOpen={isSidebarOpen} />;
      
    }
  };

  return (
    <div style={styles.container}>
      {/* Passez isSidebarOpen à la Navbar */}
      <Navbar onLogout={handleLogout} isSidebarOpen={isSidebarOpen} />
      <div style={styles.dashboard}>
        {/* Passez setIsSidebarOpen à la Sidebar */}
        <Sidebar setActiveComponent={setActiveComponent} setIsSidebarOpen={setIsSidebarOpen} onLogout={handleLogout}/>
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
  mainContent: {
    flexGrow: 1,
    padding: '20px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};

export default Dashboard;