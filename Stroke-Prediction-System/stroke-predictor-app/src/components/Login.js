import React, { useState } from 'react';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Alert
} from '@mui/material';
import { ArrowBack, Login as LoginIcon } from '@mui/icons-material';

const Login = ({ onLogin, onBack }) => {
  const [userType, setUserType] = useState('user');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });

  const handleLogin = () => {
    // Simple authentication - in real app, connect to backend
    if (credentials.username && credentials.password) {
      onLogin({
        username: credentials.username,
        type: userType,
        name: userType === 'admin' ? 'Admin User' : 'Patient User'
      });
    }
  };

  return (
    <Box
    sx={{
      backgroundImage: 'url("https://d1vbn70lmn1nqe.cloudfront.net/prod/wp-content/uploads/2022/09/07035722/Mengenal-Stroke-Hemoragik-Kondisi-yang-Bisa-Berakibat-Fatal.jpg.webp")',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      minHeight: '100vh',
      width: '100vw',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'fixed',
      top: 0,
      left: 0
    }}
  >
      <Button startIcon={<ArrowBack />} onClick={onBack} sx={{ mb: 2 }}>
        Back to Home
      </Button>

      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
          Login
        </Typography>

        <ToggleButtonGroup
          value={userType}
          exclusive
          onChange={(e, newType) => setUserType(newType)}
          fullWidth
          sx={{ mb: 3 }}
        >
          <ToggleButton value="user">
            👤 User
          </ToggleButton>
          <ToggleButton value="admin">
            🛡️ Admin
          </ToggleButton>
        </ToggleButtonGroup>

        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            margin="normal"
          />

          <Alert severity="info" sx={{ mt: 2, mb: 2 }}>
            Demo credentials: any username/password will work
          </Alert>

          <Button
            fullWidth
            variant="contained"
            size="large"
            startIcon={<LoginIcon />}
            onClick={handleLogin}
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Login;