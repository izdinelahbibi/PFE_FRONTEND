import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Sidebar from './Sidebarv';
import Profil from './Profil/Profil';
import Demandesvalide from './Demandevalide/Demandevalide';
import Consulterdemande2 from './Consulterdemande2/Consulterdemande2';


import 'bootstrap/dist/css/bootstrap.min.css';

const ValidateurDashboard = () => {
  const [activeComponent, setActiveComponent] = useState('welcome');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    localStorage.removeItem('userToken');
    navigate('/login');
  };

  const renderComponent = () => {
    switch (activeComponent) {
      default:
      case 'Consulterdemande2':
        return <Consulterdemande2 isSidebarOpen={isSidebarOpen} />;
      case 'Demandevalide':
        return <Demandesvalide isSidebarOpen={isSidebarOpen} />;
  
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

export default ValidateurDashboard;