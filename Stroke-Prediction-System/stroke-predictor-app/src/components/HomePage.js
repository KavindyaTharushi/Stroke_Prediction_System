import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
  Card,
  Grid
} from '@mui/material';
import { ArrowForward, MedicalInformation } from '@mui/icons-material';

const HomePage = ({ onNavigate }) => {
  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'white' }}>
      {/* Header */}
      <AppBar 
        position="static" 
        sx={{ 
          backgroundColor: '#8B0000',
          boxShadow: 'none'
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
            onClick={() => onNavigate('login')}
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
            Login
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center">
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Typography 
              variant="h2" 
              component="h1"
              sx={{ 
                fontWeight: 'bold',
                color: '#8B0000',
                mb: 2,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              Stroke Risk Assessment
            </Typography>
            
            {/* Stroke Description */}
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                mb: 3,
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
            >
              A stroke occurs when the blood supply to part of the brain is interrupted or reduced, 
              preventing brain tissue from getting oxygen and nutrients. According to the American 
              Stroke Association, stroke is a leading cause of death and disability worldwide. 
              Early detection and risk assessment are crucial for prevention.
            </Typography>

            {/* How the App Works Description */}
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                mb: 4,
                lineHeight: 1.6,
                fontSize: '1.1rem'
              }}
            >
              Our platform uses a clinically-trained machine learning model that analyzes key health 
              indicators including blood pressure, cholesterol levels, medical history, and lifestyle 
              factors to provide accurate stroke risk assessment and personalized prevention 
              recommendations based on established medical research.
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Button
                variant="contained"
                size="large"
                onClick={() => onNavigate('login')}
                endIcon={<ArrowForward />}
                sx={{
                  backgroundColor: '#8B0000',
                  borderRadius: '25px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#A52A2A',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Start Assessment
              </Button>
            </Box>
          </Grid>

          {/* Right Image - USING WORKING MEDICAL IMAGE */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                width: '100%',
                height: '400px',
                backgroundColor: '#F5F5F5',
                borderRadius: '10px',
                backgroundImage: `url('https://www.homage.com.au/wp-content/uploads/sites/3/2022/06/bigstock-Women-With-Pain-At-The-Heart-417321265.jpg')`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                boxShadow: '0 10px 30px rgba(139, 0, 0, 0.1)'
              }}
            />
          </Grid>
        </Grid>

        {/* Features with Accuracy Box in Bottom Left - SHORTER BOXES */}
        <Box sx={{ mt: 10 }}>
          <Grid container spacing={3}>
            {/* Accuracy Box - Bottom Left */}
            <Grid item xs={12} md={3}>
              <Card 
                sx={{ 
                  backgroundColor: '#8B0000',
                  color: 'white',
                  p: 3,
                  borderRadius: '10px',
                  textAlign: 'center',
                  height: '110px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}
              >
                <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 1 }}>
                  93%
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  Accuracy
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.9, mt: 1 }}>
                  ML model 
                </Typography>
              </Card>
            </Grid>

            {/* Other Feature Cards - UPDATED TO BE ACCURATE */}
            <Grid item xs={12} md={3}>
              <Card sx={{ 
                p: 3,
                borderRadius: '10px', 
                border: '1px solid #e0e0e0', 
                height: '110px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ color: '#8B0000', fontWeight: 'bold', mb: 1 }}>
                  ML-Powered
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trained prediction model
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                p: 3,
                borderRadius: '10px', 
                border: '1px solid #e0e0e0', 
                height: '110px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ color: '#8B0000', fontWeight: 'bold', mb: 1 }}>
                  Secure & Private
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Trusted data protection
                </Typography>
              </Card>
            </Grid>

            <Grid item xs={12} md={3}>
              <Card sx={{ 
                p: 3,
                borderRadius: '10px', 
                border: '1px solid #e0e0e0', 
                height: '110px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                textAlign: 'center'
              }}>
                <Typography variant="h6" sx={{ color: '#8B0000', fontWeight: 'bold', mb: 1 }}>
                  Instant Results
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time risk analysis
                </Typography>
              </Card>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;