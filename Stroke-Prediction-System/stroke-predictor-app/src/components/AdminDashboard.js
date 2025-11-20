import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Box,
  Grid,
  Card,
  CardContent,
  Tab,
  Tabs,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { Logout, Analytics, People, Assessment, History, Description, Download, Report, Visibility } from '@mui/icons-material';
import PredictionForm from './PredictionForm';
import UserHistory from './UserHistory';

const AdminDashboard = ({ user, onLogout }) => {
  const [submissions, setSubmissions] = useState([]);
  const [currentTab, setCurrentTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [highRiskDialog, setHighRiskDialog] = useState(false);
  const [exportDialog, setExportDialog] = useState(false);

  // Load submissions from localStorage
  useEffect(() => {
    const savedSubmissions = JSON.parse(localStorage.getItem('strokeSubmissions') || '[]');
    setSubmissions(savedSubmissions);
  }, []);

  // Use the SAME risk logic as API.py
  const getRiskLevel = (probability) => {
    if (probability > 0.7) return 'HIGH';
    if (probability > 0.4) return 'MEDIUM';
    return 'LOW';
  };

  const getRiskColor = (probability) => {
    if (probability > 0.7) return 'error';
    if (probability > 0.4) return 'warning';
    return 'success';
  };

  // Update stats with API risk ranges
  const stats = {
    total: submissions.length,
    highRisk: submissions.filter(s => s.probability > 0.7).length,
    mediumRisk: submissions.filter(s => s.probability > 0.4 && s.probability <= 0.7).length,
    lowRisk: submissions.filter(s => s.probability <= 0.4).length
  };

  const handlePrediction = (prediction) => {
    const updatedSubmissions = [prediction, ...submissions];
    setSubmissions(updatedSubmissions);
    localStorage.setItem('strokeSubmissions', JSON.stringify(updatedSubmissions));
    showSnackbar('Assessment saved successfully!', 'success');
  };

  // Button Handlers
  const handleExportCSV = () => {
    if (submissions.length === 0) {
      showSnackbar('No data to export', 'warning');
      return;
    }

    const csvHeaders = ['Timestamp', 'Age', 'Gender', 'Hypertension', 'Heart Disease', 'Glucose', 'BMI', 'Probability', 'Risk Level'];
    const csvData = submissions.map(sub => [
      sub.timestamp,
      sub.formData.age,
      sub.formData.gender,
      sub.formData.hypertension ? 'Yes' : 'No',
      sub.formData.heart_disease ? 'Yes' : 'No',
      sub.formData.avg_glucose_level,
      sub.formData.bmi,
      `${(sub.probability * 100).toFixed(1)}%`,
      getRiskLevel(sub.probability)
    ]);

    const csvContent = [csvHeaders, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stroke_assessments_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    showSnackbar('Data exported to CSV successfully!', 'success');
    setExportDialog(false);
  };

  const handleGenerateReport = () => {
    if (submissions.length === 0) {
      showSnackbar('No data to generate report', 'warning');
      return;
    }

    const reportData = {
      generatedAt: new Date().toLocaleString(),
      totalAssessments: stats.total,
      riskDistribution: {
        high: stats.highRisk,
        medium: stats.mediumRisk,
        low: stats.lowRisk
      },
      highRiskPatients: submissions
        .filter(sub => sub.probability > 0.7)
        .map(sub => ({
          age: sub.formData.age,
          gender: sub.formData.gender,
          probability: `${(sub.probability * 100).toFixed(1)}%`,
          timestamp: sub.timestamp
        }))
    };

    const reportContent = `
STROKE RISK ASSESSMENT REPORT
Generated: ${reportData.generatedAt}

SUMMARY:
========
Total Assessments: ${reportData.totalAssessments}
High Risk Cases: ${reportData.riskDistribution.high}
Medium Risk Cases: ${reportData.riskDistribution.medium}
Low Risk Cases: ${reportData.riskDistribution.low}

RISK DISTRIBUTION:
==================
High Risk (>70%): ${((stats.highRisk / stats.total) * 100).toFixed(1)}%
Medium Risk (40-70%): ${((stats.mediumRisk / stats.total) * 100).toFixed(1)}%
Low Risk (≤40%): ${((stats.lowRisk / stats.total) * 100).toFixed(1)}%

HIGH RISK PATIENTS (Require Immediate Attention):
=================================================
${reportData.highRiskPatients.map(patient => 
  `• ${patient.age}y ${patient.gender} - ${patient.probability} risk (Assessed: ${patient.timestamp})`
).join('\n')}

This report was generated automatically by StrokeRisk Pro Admin Dashboard.
    `.trim();

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `stroke_risk_report_${new Date().toISOString().split('T')[0]}.txt`;
    link.click();
    window.URL.revokeObjectURL(url);
    
    showSnackbar('Report generated successfully!', 'success');
  };

  const handleViewHighRisk = () => {
    if (stats.highRisk === 0) {
      showSnackbar('No high risk patients found', 'info');
      return;
    }
    setHighRiskDialog(true);
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear all assessment data? This action cannot be undone.')) {
      localStorage.removeItem('strokeSubmissions');
      setSubmissions([]);
      showSnackbar('All data cleared successfully', 'success');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const tabs = [
    { label: 'Analytics', icon: <Analytics /> },
    { label: 'All Submissions', icon: <Assessment /> },
    { label: 'Risk Assessment', icon: <Description /> },
    { label: 'History', icon: <History /> }
  ];

  const highRiskPatients = submissions.filter(sub => sub.probability > 0.7);

  return (
    <Box sx={{ backgroundColor: 'white', minHeight: '100vh' }}>
      <AppBar position="static" sx={{ backgroundColor: '#8B0000' }}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            Admin Dashboard 🛡️
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Logout />} 
            onClick={onLogout}
            sx={{
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)',
                transform: 'translateY(-1px)'
              },
              transition: 'all 0.2s ease'
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ mt: 3 }}>
        {/* Tabs Navigation */}
        <Paper sx={{ mb: 3, backgroundColor: '#f5f5f5' }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)} 
            centered
            sx={{
              '& .MuiTab-root': {
                color: '#8B0000',
                fontWeight: 'bold'
              },
              '& .Mui-selected': {
                color: '#8B0000'
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#8B0000'
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Paper>

        {/* Analytics Tab */}
        {currentTab === 0 && (
          <Box>
            {/* Stats Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
              {[
                { label: 'Total Assessments', value: stats.total, color: '#8B0000', icon: <Assessment /> },
                { label: 'High Risk', value: stats.highRisk, color: '#dc2626', icon: <Analytics />, subtitle: 'Probability > 70%' },
                { label: 'Medium Risk', value: stats.mediumRisk, color: '#ea580c', icon: <Analytics />, subtitle: 'Probability 40-70%' },
                { label: 'Low Risk', value: stats.lowRisk, color: '#16a34a', icon: <People />, subtitle: 'Probability ≤ 40%' }
              ].map((stat, index) => (
                <Grid item xs={12} sm={3} key={index}>
                  <Card 
                    sx={{ 
                      borderLeft: `4px solid ${stat.color}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                      }
                    }}
                  >
                    <CardContent>
                      <Box display="flex" alignItems="center" gap={1}>
                        {React.cloneElement(stat.icon, { sx: { color: stat.color } })}
                        <Typography variant="h6" sx={{ color: stat.color, fontWeight: 'bold' }}>
                          {stat.label}
                        </Typography>
                      </Box>
                      <Typography variant="h3" sx={{ color: stat.color, fontWeight: 'bold', mt: 1 }}>
                        {stat.value}
                      </Typography>
                      {stat.subtitle && (
                        <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
                          {stat.subtitle}
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* Action Buttons */}
            <Grid container spacing={2} sx={{ mb: 4 }}>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => setExportDialog(true)}
                  sx={{
                    backgroundColor: '#8B0000',
                    '&:hover': {
                      backgroundColor: '#A52A2A',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Export to CSV
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<Report />}
                  onClick={handleGenerateReport}
                  sx={{
                    backgroundColor: '#2563eb',
                    '&:hover': {
                      backgroundColor: '#1d4ed8',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Generate Report
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  startIcon={<Visibility />}
                  onClick={handleViewHighRisk}
                  disabled={stats.highRisk === 0}
                  sx={{
                    backgroundColor: '#dc2626',
                    '&:hover': {
                      backgroundColor: '#b91c1c',
                      transform: 'translateY(-2px)'
                    },
                    '&:disabled': {
                      backgroundColor: '#9ca3af'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  View High Risk ({stats.highRisk})
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={handleClearData}
                  disabled={submissions.length === 0}
                  sx={{
                    '&:hover': {
                      transform: 'translateY(-2px)'
                    },
                    transition: 'all 0.2s ease'
                  }}
                >
                  Clear All Data
                </Button>
              </Grid>
            </Grid>

            {/* Risk Distribution Chart */}
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#8B0000', fontWeight: 'bold' }}>
                    Risk Distribution
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
                    {[
                      { level: 'HIGH RISK', color: '#dc2626', count: stats.highRisk, threshold: '>70%' },
                      { level: 'MEDIUM RISK', color: '#ea580c', count: stats.mediumRisk, threshold: '40-70%' },
                      { level: 'LOW RISK', color: '#16a34a', count: stats.lowRisk, threshold: '≤40%' }
                    ].map((risk, index) => (
                      <Box key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="body2" sx={{ color: risk.color, fontWeight: 'bold' }}>
                            {risk.level} ({risk.threshold})
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {risk.count} cases
                          </Typography>
                        </Box>
                        <Box sx={{ width: '100%', height: 25, backgroundColor: '#f5f5f5', borderRadius: 2 }}>
                          <Box 
                            sx={{ 
                              width: `${(risk.count / Math.max(stats.total, 1)) * 100}%`, 
                              height: '100%', 
                              backgroundColor: risk.color,
                              borderRadius: 2
                            }} 
                          />
                        </Box>
                      </Box>
                    ))}
                  </Box>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card sx={{ p: 3 }}>
                  <Typography variant="h6" gutterBottom sx={{ color: '#8B0000', fontWeight: 'bold' }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Button 
                      variant="outlined" 
                      startIcon={<Download />}
                      onClick={() => setExportDialog(true)}
                      sx={{ 
                        color: '#8B0000', 
                        borderColor: '#8B0000',
                        '&:hover': {
                          backgroundColor: '#8B0000',
                          color: 'white'
                        }
                      }}
                    >
                      Export Data
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<Report />}
                      onClick={handleGenerateReport}
                      sx={{ 
                        color: '#2563eb', 
                        borderColor: '#2563eb',
                        '&:hover': {
                          backgroundColor: '#2563eb',
                          color: 'white'
                        }
                      }}
                    >
                      Generate Report
                    </Button>
                    <Button 
                      variant="outlined" 
                      startIcon={<Visibility />}
                      onClick={handleViewHighRisk}
                      disabled={stats.highRisk === 0}
                      sx={{ 
                        color: '#dc2626', 
                        borderColor: '#dc2626',
                        '&:hover': {
                          backgroundColor: '#dc2626',
                          color: 'white'
                        },
                        '&:disabled': {
                          color: '#9ca3af',
                          borderColor: '#9ca3af'
                        }
                      }}
                    >
                      View High Risk
                    </Button>
                  </Box>
                </Card>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* All Submissions Tab */}
        {currentTab === 1 && (
          <Paper elevation={3}>
            <Box sx={{ p: 2, backgroundColor: '#8B0000', color: 'white' }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                All User Submissions ({submissions.length})
              </Typography>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>Timestamp</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>Age</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>Gender</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>Hypertension</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>Heart Disease</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>Glucose</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>BMI</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>Probability</TableCell>
                    <TableCell sx={{ fontWeight: 'bold', color: '#8B0000' }}>Risk Level</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {submissions.map((submission, index) => (
                    <TableRow key={index} hover>
                      <TableCell>{submission.timestamp}</TableCell>
                      <TableCell>{submission.formData.age}</TableCell>
                      <TableCell>{submission.formData.gender}</TableCell>
                      <TableCell>{submission.formData.hypertension ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{submission.formData.heart_disease ? 'Yes' : 'No'}</TableCell>
                      <TableCell>{submission.formData.avg_glucose_level}</TableCell>
                      <TableCell>{submission.formData.bmi}</TableCell>
                      <TableCell sx={{ fontWeight: 'bold' }}>
                        {(submission.probability * 100).toFixed(1)}%
                      </TableCell>
                      <TableCell>
                        <Chip 
                          label={getRiskLevel(submission.probability)} 
                          color={getRiskColor(submission.probability)}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        )}

        {/* Risk Assessment Tab - ADMIN VERSION (No Recommendations) */}
        {currentTab === 2 && (
          <Box>
            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#8B0000', fontWeight: 'bold' }}>
                Stroke Risk Assessment
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Use the form below to perform stroke risk assessments. Results will be saved to the database for analytics.
                <br />
                <strong>Note:</strong> This view shows only the risk calculation with simple medical recommendations. Not customized for each patient.
              </Typography>
            </Paper>
            {/* Pass showAdminView prop to hide recommendations */}
            <PredictionForm onPrediction={handlePrediction} showAdminView={true} />
          </Box>
        )}

        {/* History Tab */}
        {currentTab === 3 && (
          <Box>
            <Paper elevation={3} sx={{ p: 3, mb: 3, backgroundColor: '#f9f9f9' }}>
              <Typography variant="h5" gutterBottom sx={{ color: '#8B0000', fontWeight: 'bold' }}>
                Assessment History
              </Typography>
              <Typography variant="body1" color="text.secondary">
                View all risk assessments performed through this admin account.
              </Typography>
            </Paper>
            <UserHistory history={submissions} />
          </Box>
        )}
      </Container>

      {/* High Risk Patients Dialog */}
      <Dialog open={highRiskDialog} onClose={() => setHighRiskDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
          <Box display="flex" alignItems="center" gap={1}>
            <Visibility />
            High Risk Patients (Require Immediate Attention)
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2, color: '#dc2626' }}>
            {highRiskPatients.length} patients with stroke probability greater than 70%
          </Typography>
          <TableContainer>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell><strong>Age</strong></TableCell>
                  <TableCell><strong>Gender</strong></TableCell>
                  <TableCell><strong>Probability</strong></TableCell>
                  <TableCell><strong>Assessed</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {highRiskPatients.map((patient, index) => (
                  <TableRow key={index} hover>
                    <TableCell>{patient.formData.age}</TableCell>
                    <TableCell>{patient.formData.gender}</TableCell>
                    <TableCell sx={{ color: '#dc2626', fontWeight: 'bold' }}>
                      {(patient.probability * 100).toFixed(1)}%
                    </TableCell>
                    <TableCell>{patient.timestamp}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setHighRiskDialog(false)}>Close</Button>
          <Button 
            onClick={handleGenerateReport}
            variant="contained"
            sx={{ backgroundColor: '#dc2626' }}
          >
            Generate Full Report
          </Button>
        </DialogActions>
      </Dialog>

      {/* Export Confirmation Dialog */}
      <Dialog open={exportDialog} onClose={() => setExportDialog(false)}>
        <DialogTitle>Export Data to CSV</DialogTitle>
        <DialogContent>
          <Typography>
            This will export {submissions.length} assessment records to a CSV file.
            Continue?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExportDialog(false)}>Cancel</Button>
          <Button onClick={handleExportCSV} variant="contained" sx={{ backgroundColor: '#8B0000' }}>
            Export
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminDashboard;