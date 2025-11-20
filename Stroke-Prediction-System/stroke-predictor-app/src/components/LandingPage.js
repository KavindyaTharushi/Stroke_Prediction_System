// components/LandingPage.js 
import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar
} from '@mui/material';
import { ArrowForward, MedicalInformation } from '@mui/icons-material';

const LandingPage = ({ onGetStarted }) => {
  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        backgroundImage: `linear-gradient(rgba(139, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url('https://d38sso7f6qz01j.cloudfront.net/original_images/hemorrhagic-stroke-1600x732.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: 'transparent',
          boxShadow: 'none',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Toolbar>
          <MedicalInformation sx={{ mr: 2, color: 'white' }} />
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              color: 'white'
            }}
          >
            StrokeRisk Pro
          </Typography>
          <Button 
            color="inherit" 
            onClick={onGetStarted}
            sx={{ 
              color: 'white',
              border: '1px solid white',
              borderRadius: '20px',
              px: 3,
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            Get Started
          </Button>
        </Toolbar>
      </AppBar>

      {/* Main Content */}
      <Container 
        maxWidth="md" 
        sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          textAlign: 'center',
          py: 8
        }}
      >
        <Typography 
          variant="h2" 
          component="h1"
          sx={{ 
            fontWeight: 'bold',
            color: 'white',
            mb: 3,
            fontSize: { xs: '2.5rem', md: '4rem' },
            lineHeight: 1.1,
            textShadow: '2px 2px 8px rgba(0,0,0,0.7)'
          }}
        >
          Assess Your Stroke Risk with Confidence
        </Typography>
        
        <Typography 
          variant="h5" 
          sx={{ 
            color: 'rgba(255,255,255,0.9)',
            mb: 6,
            lineHeight: 1.6,
            fontSize: '1.4rem',
            maxWidth: '700px',
            textShadow: '1px 1px 3px rgba(0,0,0,0.5)',
            fontWeight: 300
          }}
        >
          Advanced machine learning technology for accurate stroke risk prediction and prevention
        </Typography>

        <Button
          variant="contained"
          size="large"
          onClick={onGetStarted}
          endIcon={<ArrowForward />}
          sx={{
            backgroundColor: '#8B0000',
            borderRadius: '30px',
            px: 8,
            py: 2,
            fontSize: '1.3rem',
            fontWeight: 'bold',
            minWidth: '200px',
            '&:hover': {
              backgroundColor: '#A52A2A',
              transform: 'translateY(-3px)',
              boxShadow: '0 15px 30px rgba(139, 0, 0, 0.4)'
            },
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 20px rgba(139, 0, 0, 0.3)'
          }}
        >
          Get Started
        </Button>
      </Container>
    </Box>
  );
};

export default LandingPage;