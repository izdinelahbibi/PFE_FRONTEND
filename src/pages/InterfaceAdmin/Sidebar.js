import React, { useEffect, useRef } from "react";
import "./Sidebar.css"; // Importez le fichier CSS

const Sidebar = ({ setActiveComponent, setIsSidebarOpen, onLogout }) => {
  const sidebarRef = useRef(null);
  const closeBtnRef = useRef(null);
  const searchBtnRef = useRef(null);

  useEffect(() => {
    const sidebar = sidebarRef.current;
    const closeBtn = closeBtnRef.current;
    const searchBtn = searchBtnRef.current;

    const menuBtnChange = () => {
      if (sidebar.classList.contains("open")) {
        closeBtn.classList.replace("bx-menu", "bx-menu-alt-right");
      } else {
        closeBtn.classList.replace("bx-menu-alt-right", "bx-menu");
      }
    };

    const handleCloseBtnClick = () => {
      const isOpen = sidebar.classList.toggle("open");
      setIsSidebarOpen(isOpen); // Met à jour l'état dans le Dashboard
      menuBtnChange();
    };

    const handleSearchBtnClick = () => {
      const isOpen = sidebar.classList.toggle("open");
      setIsSidebarOpen(isOpen); // Met à jour l'état dans le Dashboard
      menuBtnChange();
    };

    if (closeBtn) {
      closeBtn.addEventListener("click", handleCloseBtnClick);
    }
    if (searchBtn) {
      searchBtn.addEventListener("click", handleSearchBtnClick);
    }

    // Nettoyer les écouteurs d'événements
    return () => {
      if (closeBtn) {
        closeBtn.removeEventListener("click", handleCloseBtnClick);
      }
      if (searchBtn) {
        searchBtn.removeEventListener("click", handleSearchBtnClick);
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
        <li onClick={() => setActiveComponent("welcome")}>
          <button className="link-button">
            <i className="bx bx-stats"></i>
            <span className="link_name">Tableau de bord</span>
          </button>
          <span className="tooltip">Tableau de bord</span>
        </li>
        <li onClick={() => setActiveComponent("users")}>
          <button className="link-button">
            <i className="bx bx-user"></i>
            <span className="link_name">Utilisateurs</span>
          </button>
          <span className="tooltip">Utilisateurs</span>
        </li>
        <li onClick={() => setActiveComponent("departements")}>
          <button className="link-button">
            <i className="bx bx-folder"></i>
            <span className="link_name">Départements</span>
          </button>
          <span className="tooltip">Départements</span>
        </li>
        <li onClick={() => setActiveComponent("rubriques")}>
          <button className="link-button">
            <i className="bx bx-category"></i>
            <span className="link_name">Rubriques</span>
          </button>
          <span className="tooltip">Rubriques</span>
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