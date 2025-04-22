import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebar'; // Nouveau composant Sidebar
import Projet from './Projet/Projet';
import DemandeAchats from './DemandeAchats/DemandeAchats';
import ConsulterDemande from './ConsulterDemande/Consulterdemande';
import Historiquedemande from './Historiquedemande/Historiquedemande';


import Profil from './Profil/Profil';
import 'bootstrap/dist/css/bootstrap.min.css';

const EmployeDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // État pour la Sidebar
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

  const renderComponent = () => {
    switch (activeComponent) {
      default:
      case 'projet':
        return <Projet isSidebarOpen={isSidebarOpen} />;
      case 'demandeachats':
        return <DemandeAchats isSidebarOpen={isSidebarOpen} />;
      case 'consulterdemande':
        return <ConsulterDemande isSidebarOpen={isSidebarOpen} />;
        case 'historiquedemande':
          return <Historiquedemande isSidebarOpen={isSidebarOpen} />;
      case 'Profil':
        return <Profil isSidebarOpen={isSidebarOpen} />;
      
      
    }
  };

  return (
    <div style={styles.container}>
      {/* Passez isSidebarOpen à la Navbar */}
      <Navbar onLogout={handleLogout} isSidebarOpen={isSidebarOpen} />
      <div style={styles.dashboard}>
        {/* Passez setIsSidebarOpen à la Sidebar */}
        <Sidebar
          setActiveComponent={setActiveComponent}
          setIsSidebarOpen={setIsSidebarOpen}
          onLogout={handleLogout}
        />
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

export default EmployeDashboard;