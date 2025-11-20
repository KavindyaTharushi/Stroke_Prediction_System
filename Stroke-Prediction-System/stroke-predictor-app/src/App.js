import React, { useState } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import LandingPage from './components/LandingPage.js'; 
import HomePage from './components/HomePage.js';
import Login from './components/Login.js';
import UserDashboard from './components/UserDashboard.js';
import AdminDashboard from './components/AdminDashboard.js';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  const [currentPage, setCurrentPage] = useState('landing'); // Start with 'landing' instead of 'home'
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentPage(userData.type === 'admin' ? 'admin' : 'user');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('landing'); // Return to landing page on logout
  };

  const handleGetStarted = () => {
    setCurrentPage('home'); // Navigate from landing to home
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'landing': // Add this case
        return <LandingPage onGetStarted={handleGetStarted} />;
      case 'home':
        return <HomePage onNavigate={setCurrentPage} />;
      case 'login':
        return <Login onLogin={handleLogin} onBack={() => setCurrentPage('home')} />;
      case 'user':
        return <UserDashboard user={user} onLogout={handleLogout} />;
      case 'admin':
        return <AdminDashboard user={user} onLogout={handleLogout} />;
      default:
        return <LandingPage onGetStarted={handleGetStarted} />; // Default to landing page
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {renderPage()}
    </ThemeProvider>
  );
}

export default App;