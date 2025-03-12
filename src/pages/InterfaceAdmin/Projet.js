// components/Projet.js
import React, { useState, useEffect } from 'react';
import ProjetList from '../../components/ProjetList';
import AddProjetModal from '../../components/AddProjetModal';
import { fetchAllProjets, addProjet } from '../../services/AllProjetService'; 
import { Modal, Button } from 'react-bootstrap'; 

const Projet = () => {
  const [projets, setProjets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [newProjet, setNewProjet] = useState({
    intitule: '',
    type_investissement: '',
    site: '',
    presentation_projet: '',
    cout_estimatif: '',
    planning: 'Annuel',
  });

  // Récupérer tous les projets
  useEffect(() => {
    const fetchProjets = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) {
          throw new Error('Utilisateur non connecté');
        }

        const projetsData = await fetchAllProjets(token); // Utiliser fetchAllProjets
        setProjets(projetsData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjets();
  }, []);

  // Ouvrir le modal d'ajout de projet
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Fermer le modal d'ajout de projet
  const closeModal = () => {
    setIsModalOpen(false);
  };

  // Gérer les changements dans le formulaire
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProjet({
      ...newProjet,
      [name]: value,
    });
  };

  // Soumettre le formulaire d'ajout de projet
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        throw new Error('Utilisateur non connecté');
      }

      await addProjet(token, newProjet); // Ajouter le nouveau projet

      closeModal(); // Fermer le modal d'ajout
      setShowSuccessModal(true); // Afficher le modal de succès
      setNewProjet({ // Réinitialiser le formulaire
        intitule: '',
        type_investissement: '',
        site: '',
        presentation_projet: '',
        cout_estimatif: '',
        planning: 'Annuel',
      });

      // Re-fetch les projets après l'ajout
      const projetsData = await fetchAllProjets(token);
      setProjets(projetsData);
    } catch (err) {
      setError(err.message);
    }
  };

  // Réinitialiser le formulaire
  const resetForm = () => {
    setNewProjet({
      intitule: '',
      type_investissement: '',
      site: '',
      presentation_projet: '',
      cout_estimatif: '',
      planning: 'Annuel',
    });
  };

  if (loading) {
    return <div>Chargement en cours...</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <>
      <ProjetList projets={projets} openModal={openModal} />
      <AddProjetModal
        isModalOpen={isModalOpen}
        closeModal={closeModal}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        newProjet={newProjet}
      />

      {/* Modal de succès */}
      <Modal show={showSuccessModal} onHide={() => setShowSuccessModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>✅ Projet ajouté avec succès !</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Le projet a été ajouté avec succès.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            onClick={() => {
              setShowSuccessModal(false); // Fermer le modal de succès
              resetForm(); // Réinitialiser le formulaire
            }}
          >
            Fermer
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Projet;