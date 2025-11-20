import React, { useState } from 'react';
import {
  Paper,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography,
  Box,
  Alert,
  CircularProgress
} from '@mui/material';
import { Calculate } from '@mui/icons-material';
import axios from 'axios';
import PredictionCharts from './PredictionCharts';

/*// HF backend URL - if hf backend deployment successful 
const API_BASE = "https://stroke-prediction-backend.hf.space";*/ 

// ADD showAdminView prop here with default value false
const PredictionForm = ({ onPrediction, showAdminView = false }) => {
  const [formData, setFormData] = useState({
    age: 50,
    gender: 'Male',
    hypertension: 0,
    heart_disease: 0,
    ever_married: 'Yes',
    work_type: 'Private',
    Residence_type: 'Urban',
    avg_glucose_level: 100,
    bmi: 25,
    smoking_status: 'never smoked'
  });

  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field) => (event) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/predict', formData);// if backend deployment successful for '/predict' endpoint, use ${API_BASE} instead.
      
      if (response.data.success) {
        const predictionResult = {
          ...response.data,
          formData: { ...formData },
          timestamp: new Date().toLocaleString()
        };
        
        setPrediction(predictionResult);
        onPrediction(predictionResult);
      } else {
        setError('Prediction failed: ' + response.data.error);
      }
    } catch (err) {
      setError('Failed to connect to server. Make sure the Python API is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          {showAdminView ? 'Admin Risk Assessment' : 'Stroke Risk Assessment Form'}
        </Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Personal Information */}
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Age"
                type="number"
                value={formData.age}
                onChange={handleChange('age')}
                inputProps={{ min: 0, max: 120 }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Gender</InputLabel>
                <Select value={formData.gender} onChange={handleChange('gender')} label="Gender">
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Ever Married</InputLabel>
                <Select value={formData.ever_married} onChange={handleChange('ever_married')} label="Ever Married">
                  <MenuItem value="Yes">Yes</MenuItem>
                  <MenuItem value="No">No</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Residence Type</InputLabel>
                <Select value={formData.Residence_type} onChange={handleChange('Residence_type')} label="Residence Type">
                  <MenuItem value="Urban">Urban</MenuItem>
                  <MenuItem value="Rural">Rural</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {/* Health Conditions */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Hypertension</InputLabel>
                <Select value={formData.hypertension} onChange={handleChange('hypertension')} label="Hypertension">
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Heart Disease</InputLabel>
                <Select value={formData.heart_disease} onChange={handleChange('heart_disease')} label="Heart Disease">
                  <MenuItem value={0}>No</MenuItem>
                  <MenuItem value={1}>Yes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Average Glucose Level"
                type="number"
                value={formData.avg_glucose_level}
                onChange={handleChange('avg_glucose_level')}
                inputProps={{ step: 0.1, min: 50, max: 300 }}
                required
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="BMI"
                type="number"
                value={formData.bmi}
                onChange={handleChange('bmi')}
                inputProps={{ step: 0.1, min: 10, max: 70 }}
                required
              />
            </Grid>

            {/* Lifestyle */}
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Smoking Status</InputLabel>
                <Select value={formData.smoking_status} onChange={handleChange('smoking_status')} label="Smoking Status">
                  <MenuItem value="never smoked">Never Smoked</MenuItem>
                  <MenuItem value="formerly smoked">Formerly Smoked</MenuItem>
                  <MenuItem value="smokes">Currently Smokes</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Work Type</InputLabel>
                <Select value={formData.work_type} onChange={handleChange('work_type')} label="Work Type">
                  <MenuItem value="Private">Private Sector</MenuItem>
                  <MenuItem value="Self-employed">Self Employed</MenuItem>
                  <MenuItem value="Govt_job">Government Job</MenuItem>
                  <MenuItem value="children">Student/Child</MenuItem>
                  <MenuItem value="Never_worked">Never Worked</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={loading ? <CircularProgress size={20} /> : <Calculate />}
                disabled={loading}
                fullWidth
                sx={{
                  backgroundColor: '#8B0000',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#A52A2A',
                  },
                  '&:disabled': {
                    backgroundColor: '#f0f0f0',
                    color: '#a0a0a0',
                  }
                }}
              >
                {loading ? 'Analyzing...' : 'Predict Stroke Risk'}
              </Button>
            </Grid>
          </Grid>
        </form>

        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </Paper>

      {/* FIXED: Pass showRecommendations prop to PredictionCharts */}
      {prediction && (
        <PredictionCharts 
          prediction={prediction} 
          formData={formData}
          showRecommendations={!showAdminView} // This will be false in admin dashboard
        />
      )}
    </Box>
  );
};

export default PredictionForm;

