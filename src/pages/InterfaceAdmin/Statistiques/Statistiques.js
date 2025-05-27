import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,  PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, Typography, Grid, CircularProgress, Paper } from '@mui/material';
import { fetchStats } from '../../../services/statService';
import './Statistiques.css';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];



const Statistiques = ({ isSidebarOpen }) => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchStats();
        setStats(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red', textAlign: 'center' }}>
        <Typography variant="h6">Erreur</Typography>
        <Typography>{error}</Typography>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div style={{ 
      marginLeft: isSidebarOpen ? '240px' : '60px', 
      transition: 'margin 0.3s ease',
      padding: '20px'
    }}>
      <Typography variant="h4" gutterBottom>
        Tableau de Bord Statistique
      </Typography>

      {/* Cartes de résumé */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Utilisateurs</Typography>
              <Typography variant="h4">{stats.users.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Départements</Typography>
              <Typography variant="h4">{stats.departements.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary">Rubriques</Typography>
              <Typography variant="h4">{stats.rubriques.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Graphiques Utilisateurs */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Répartition par rôle</Typography>
            <PieChart width={500} height={300}>
              <Pie
                data={stats.users.roleData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {stats.users.roleData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Statut des utilisateurs</Typography>
            <BarChart width={500} height={300} data={stats.users.statusData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" name="Nombre" />
            </BarChart>
          </Paper>
        </Grid>
      </Grid>

      {/* Derniers utilisateurs */}
      <Paper sx={{ p: 2, mb: 4 }}>
        <Typography variant="h6" gutterBottom>Derniers utilisateurs</Typography>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f5f5f5' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Nom</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Email</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Rôle</th>
              </tr>
            </thead>
            <tbody>
              {stats.users.recentUsers.map((user, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                  <td style={{ padding: '12px' }}>{user.nom} {user.prenom}</td>
                  <td style={{ padding: '12px' }}>{user.email}</td>
                  <td style={{ padding: '12px' }}>{user.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Paper>

      {/* Rubriques */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Répartition des rubriques</Typography>
            <PieChart width={500} height={300}>
              <Pie
                data={stats.rubriques.data}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name }) => name}
              >
                {stats.rubriques.data.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Dernières rubriques</Typography>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Nom</th>
                    <th style={{ padding: '12px', textAlign: 'left' }}>Date création</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.rubriques.recentRubriques.map((rubrique, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{rubrique.nom}</td>
                      <td style={{ padding: '12px' }}>
                        {new Date(rubrique.date_creation).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Paper>

          
        </Grid>
      </Grid>
    </div>
  );
};

export default Statistiques;