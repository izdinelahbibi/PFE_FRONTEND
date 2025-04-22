import React from 'react';
import logo from '../assets/logo.jpg'; // Importez le logo ici

const Navbar = ({ isSidebarOpen }) => {
  const navbarStyle = {
    padding: '10px 20px',
    backgroundColor: '#004f83',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: isSidebarOpen ? '250px' : '78px', // Ajustez la marge gauche
    transition: 'margin-left 0.5s ease', // Transition fluide
  };

  const brandStyle = {
    fontSize: '1.3rem',
    marginLeft: '10px',
    color: '#fff',
    whiteSpace: 'nowrap', // Empêche le texte de passer à la ligne
  };

  const logoStyle = {
    width: '50px',
    height: '40px',
    verticalAlign: 'top', // Alignement vertical du logo
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
    </nav>
  );
};

export default Navbar;