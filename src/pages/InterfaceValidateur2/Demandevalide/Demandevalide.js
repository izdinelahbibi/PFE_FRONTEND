import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner, Alert } from 'react-bootstrap';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const Demandesvalide = ({ isSidebarOpen }) => {
  const [demandes, setDemandes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDemandesApprouvees = async () => {
      try {
        const token = localStorage.getItem('userToken');
        if (!token) return;

        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/demandes/approuvees`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Erreur lors de la récupération des demandes');
        }

        const data = await response.json();
        setDemandes(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDemandesApprouvees();
  }, []);
  const generatePDF = (demande) => {
    const doc = new jsPDF();
    
    // Couleurs
    const primaryColor = '#3498db';
    const textColor = '#333333';
    
    // En-tête
    doc.setFontSize(16);
    doc.setTextColor(textColor);
    doc.text('GROUPE CHIMIQUE TUNISIEN', 105, 15, null, null, 'center');
    
    
    // Direction et Division
    doc.setFontSize(12);
    doc.text('Direction Informatique', 20, 30);
    doc.text('Division Informatique', 20, 36);
    
    // Date
    const today = new Date();
    const formattedDate = today.toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, '-');
    doc.text(`Le ${formattedDate}`, 160, 36);
    
    // Ligne séparatrice
    doc.setDrawColor(200);
    doc.line(15, 42, 195, 42);
    
    // Titre de section
    doc.setFontSize(14);
    doc.text('B-Estimation de Prix', 15, 50);
    
    // Tableau des matériels - Utilisation correcte de autoTable
    autoTable(doc, {
      startY: 55,
      head: [['Matériel', 'Quantité', 'Prix Utilitaire DTHTVA', 'Prix Total DTHTVA']],
      body: [
        [demande.description|| 'N/A', demande.quantite || '0', demande.budget || '0.000', (demande.quantite * demande.budget || 0).toFixed(3)],
        ['Total', '', '', (demande.quantite * demande.budget || 0).toFixed(3)]
      ],
      styles: {
        fontSize: 10,
        cellPadding: 3,
        valign: 'middle'
      },
      headStyles: {
        fillColor: primaryColor,
        textColor: 255,
        fontStyle: 'bold'
      }
    });
    
    // Signature
    doc.setFontSize(12);
    const finalY = doc.lastAutoTable.finalY || 70;
    doc.text('Division Informatique', 20, finalY + 10);
    
    // Enregistrement
    doc.save(`Demande_Achat_${demande.projet_nom}_${demande.id}.pdf`);
  };

  if (loading) {
    return (
      <div style={{ 
        marginLeft: isSidebarOpen ? '250px' : '80px', 
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ marginLeft: isSidebarOpen ? '250px' : '80px', padding: '20px' }}>
        <Alert variant="danger">{error}</Alert>
      </div>
    );
  }

  return (
    <div style={{ 
      marginLeft: isSidebarOpen ? '250px' : '80px', 
      padding: '20px',
      transition: 'margin-left 0.3s ease'
    }}>
      <h2>Demandes Approuvées</h2>
      
      {demandes.length === 0 ? (
        <Alert variant="info">Aucune demande approuvée pour le moment.</Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Projet</th>
              <th>Description</th>
              <th>Quantité</th>
              <th>Budget</th>
              <th>Priorité</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {demandes.map((demande) => (
              <tr key={demande.id}>
                <td>{demande.projet_nom}</td>
                <td>{demande.description}</td>
                <td>{demande.quantite}</td>
                <td>{demande.budget}</td>
                <td>{demande.priorite}</td>
                <td>{new Date(demande.date_creation).toLocaleDateString()}</td>
                <td>
                  <Button 
                    variant="success" 
                    size="sm"
                    onClick={() => generatePDF(demande)}
                  >
                    Exporter PDF
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default Demandesvalide;