import React, { useEffect, useRef } from 'react';
import './Sidebarv.css'; 


const Sidebar = ({ setActiveComponent, setIsSidebarOpen, onLogout }) => {
  const sidebarRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const closeBtn = closeBtnRef.current;

    const menuBtnChange = () => {
      if (sidebar.classList.contains('open')) {
        closeBtn.classList.replace('bx-menu', 'bx-menu-alt-right');
      } else {
        closeBtn.classList.replace('bx-menu-alt-right', 'bx-menu');
      }
    };

    const handleCloseBtnClick = () => {
      const isOpen = sidebar.classList.toggle('open');
      setIsSidebarOpen(isOpen); // Met à jour l'état dans EmployeDashboard
      menuBtnChange();
    };

    if (closeBtn) {
      closeBtn.addEventListener('click', handleCloseBtnClick);
    }

    // Nettoyer les écouteurs d'événements
    return () => {
      if (closeBtn) {
        closeBtn.removeEventListener('click', handleCloseBtnClick);
      }
    };
  }, [setIsSidebarOpen]);

  return (
    <div className="sidebar" ref={sidebarRef}>
      <div className="logo_details">
        <div className="logo_name">GCT</div>
        <i className="bx bx-menu" id="btn" ref={closeBtnRef}></i>
      </div>
      <ul className="nav-list">
      
      
      
        <li onClick={() => setActiveComponent('consulterdemande')}>
          <button className="link-button">
            <i className="bx bx-file"></i>
            <span className="link_name">Consulter Demandes</span>
          </button>
          <span className="tooltip">Consulter Demandes</span>
        </li>

        <li onClick={() => setActiveComponent('Demandevalide')}>
          <button className="link-button">
            <i className="bx bx-check"></i>
            <span className="link_name">Demande Validé</span>
          </button>
          <span className="tooltip">Demande Validé</span>
        </li>

        <li onClick={() => setActiveComponent('projet')}>
          <button className="link-button">
            <i className="bx bx-pie-chart-alt-2"></i>
            <span className="link_name">Projets</span>
          </button>
          <span className="tooltip">Projets</span>
        </li>


        
  
        {/* Bouton de déconnexion */}
        <li onClick={onLogout}>
          <button className="link-button">
            <i className="bx bx-log-out"></i>
            <span className="link_name">Déconnexion</span>
          </button>
          <span className="tooltip">Déconnexion</span>
        </li>
      </ul>

        {/* Ajoutez la section profil en dehors de nav-list, en bas de la sidebar */}
        <div className="profile">
        <li onClick={() => setActiveComponent("Profil")}>
          <button className="link-profil">
            <i className="bx bx-user"></i>
          </button>
          <span className="tooltip"> Profil</span>
        </li>
      </div>
      
    </div>
  );
};

export default Sidebar;