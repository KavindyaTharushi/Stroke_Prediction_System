import React, { useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Tab,
  Tabs,
  Paper
} from '@mui/material';
import { Logout, Assessment, History } from '@mui/icons-material';
import PredictionForm from './PredictionForm.js';
import PredictionCharts from './PredictionCharts.js';
import UserHistory from './UserHistory.js';

const UserDashboard = ({ user, onLogout }) => {
  const [currentTab, setCurrentTab] = useState(0);
  const [predictionHistory, setPredictionHistory] = useState([]);

  const addToHistory = (prediction) => {
    setPredictionHistory(prev => [{
      id: Date.now(),
      timestamp: new Date().toLocaleString(),
      ...prediction
    }, ...prev]);
  };

  const tabs = [
    { label: 'Risk Assessment', icon: <Assessment />, component: <PredictionForm onPrediction={addToHistory} /> },
    { label: 'My History', icon: <History />, component: <UserHistory history={predictionHistory} /> }
  ];

  return (
    <div>
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#800000', // Maroon color
        }}
      >
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: 'white' }}>
            Welcome, {user.name} 👤
          </Typography>
          <Button 
            color="inherit" 
            startIcon={<Logout />} 
            onClick={onLogout}
            sx={{ color: 'white' }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 2 }}>
        <Paper sx={{ width: '100%', backgroundColor: 'white' }}>
          <Tabs 
            value={currentTab} 
            onChange={(e, newValue) => setCurrentTab(newValue)} 
            centered
            sx={{
              '& .MuiTab-root': {
                color: '#800000', // Maroon for inactive tabs
              },
              '& .Mui-selected': {
                color: '#800000', // Maroon for active tab
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#800000', // Maroon indicator
              }
            }}
          >
            {tabs.map((tab, index) => (
              <Tab key={index} icon={tab.icon} label={tab.label} />
            ))}
          </Tabs>
        </Paper>

        <Box sx={{ mt: 3 }}>
          {tabs[currentTab].component}
        </Box>
      </Container>
    </div>
  );
};

export default UserDashboard;