import React from 'react';
import logo from '../assets/logo.jpg'; // Importez le logo ici

const Navbar = ({ onLogout }) => {
  const navbarStyle = {
    padding: '10px 20px',
    backgroundColor: '#007bff', // Couleur de fond de la navbar
    display: 'flex',
    justifyContent: 'space-between', // Pour espacer les éléments
    alignItems: 'center', // Alignement vertical des éléments
  };

  const brandStyle = {
    fontSize: '1.3rem',
    marginLeft: '10px',
    color: '#fff', // Couleur du texte
  };

  const logoStyle = {
    width: '50px',
    height: '40px',
    verticalAlign: 'top', // Alignement vertical du logo
  };

  const logoutButtonStyle = {
    padding: '5px 15px',
    backgroundColor: '#dc3545', // Couleur rouge pour le bouton
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  return (
    <nav style={navbarStyle}>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={logo}
          alt="Logo de la société"
          style={logoStyle}
        />
        <span style={brandStyle}>Groupe Chimique Tunisien</span>
      </div>
      <button style={logoutButtonStyle} onClick={onLogout}>
        Déconnexion
      </button>
    </nav>
  );
};

export default Navbar;