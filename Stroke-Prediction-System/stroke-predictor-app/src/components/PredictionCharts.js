import React from 'react';
import {
  Paper,
  Typography,
  Grid,
  Box,
  LinearProgress,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Warning, CheckCircle, Error, LocalHospital, Favorite, FitnessCenter } from '@mui/icons-material';

const PredictionCharts = ({ prediction, formData }) => {
  // Data for probability pie chart
  const probabilityData = [
    { name: 'Stroke Risk', value: prediction.probability * 100 },
    { name: 'Low Risk', value: 100 - (prediction.probability * 100) }
  ];

  // Data for risk factors
  const riskFactorsData = [
    { factor: 'Age', value: formData.age, threshold: 65 },
    { factor: 'Glucose', value: formData.avg_glucose_level, threshold: 140 },
    { factor: 'BMI', value: formData.bmi, threshold: 30 },
  ];

  const COLORS = ['#800000', '#4ECDC4']; // Maroon and teal

  const getRiskColor = (probability) => {
    if (probability > 0.7) return '#d32f2f'; // Dark red for high
    if (probability > 0.4) return '#ed6c02'; // Orange for medium
    return '#2e7d32'; // Green for low
  };

  // Medically Approved Recommendations
  const getMedicalRecommendations = (riskLevel) => {
    const baseRecommendations = {
      HIGH: {
        icon: <Error sx={{ color: '#d32f2f' }} />,
        title: '🚨 High Risk - Immediate Medical Consultation Recommended',
        color: '#d32f2f',
        recommendations: [
          "Schedule immediate appointment with healthcare provider",
          "Consult cardiologist or neurologist for comprehensive evaluation",
          "Monitor blood pressure daily (Target: <120/80 mmHg) - WHO Guidelines",
          "Emergency action plan for stroke symptoms (FAST protocol)",
          "Consider medication review with doctor (antiplatelets, statins)",
          "Regular cardiovascular screenings every 3-6 months - AHA Recommendations"
        ],
        sources: ["American Heart Association", "World Health Organization", "CDC"]
      },
      MEDIUM: {
        icon: <Warning sx={{ color: '#ed6c02' }} />,
        title: '⚠️ Medium Risk - Preventive Care Recommended',
        color: '#ed6c02',
        recommendations: [
          "Regular health checkups every 6 months",
          "Maintain blood pressure below 130/85 mmHg - AHA Standards",
          "LDL cholesterol target <100 mg/dL - NCEP Guidelines",
          "30 minutes moderate exercise 5 days/week - WHO Physical Activity",
          "DASH diet: Fruits, vegetables, low sodium - NHLBI Recommendation",
          "Smoking cessation and alcohol moderation - CDC Guidelines"
        ],
        sources: ["American Stroke Association", "National Institutes of Health"]
      },
      LOW: {
        icon: <CheckCircle sx={{ color: '#2e7d32' }} />,
        title: '✅ Low Risk - Maintain Healthy Lifestyle',
        color: '#2e7d32',
        recommendations: [
          "Annual preventive health screenings",
          "Continue balanced diet rich in fruits and vegetables",
          "Regular physical activity (150 mins/week moderate) - WHO",
          "Maintain healthy weight (BMI 18.5-24.9)",
          "Blood pressure monitoring monthly",
          "Avoid tobacco and limit alcohol consumption"
        ],
        sources: ["World Health Organization", "American Heart Association"]
      }
    };

    return baseRecommendations[riskLevel] || baseRecommendations.LOW;
  };

  const recommendations = getMedicalRecommendations(prediction.risk_level);

  return (
    <Paper elevation={3} sx={{ p: 3, mt: 2 }}>
      <Typography variant="h5" gutterBottom sx={{ color: '#800000', fontWeight: 'bold' }}>
        Prediction Results
      </Typography>

      <Grid container spacing={3}>
        {/* Risk Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, textAlign: 'center', bgcolor: '#fafafa', border: `2px solid ${getRiskColor(prediction.probability)}` }}>
            <Typography variant="h6" gutterBottom sx={{ color: '#800000', fontWeight: 'bold' }}>
              Stroke Probability
            </Typography>
            <Typography variant="h3" sx={{ color: getRiskColor(prediction.probability), mb: 1, fontWeight: 'bold' }}>
              {(prediction.probability * 100).toFixed(1)}%
            </Typography>
            <LinearProgress 
              variant="determinate" 
              value={prediction.probability * 100} 
              sx={{ 
                height: 10, 
                borderRadius: 5, 
                mb: 1,
                backgroundColor: '#f0f0f0',
                '& .MuiLinearProgress-bar': {
                  backgroundColor: getRiskColor(prediction.probability)
                }
              }}
            />
            <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 'bold' }}>
              {prediction.risk_level} RISK
            </Typography>
          </Paper>
        </Grid>

        {/* Probability Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: '#fafafa' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#800000', fontWeight: 'bold' }}>
              Risk Distribution
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={probabilityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {probabilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value.toFixed(1)}%`} />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Risk Factors Bar Chart */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, bgcolor: '#fafafa' }}>
            <Typography variant="h6" gutterBottom align="center" sx={{ color: '#800000', fontWeight: 'bold' }}>
              Your Health Metrics
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={riskFactorsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="factor" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#800000" name="Your Value" />
                <Bar dataKey="threshold" fill="#4ECDC4" name="Risk Threshold" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Medical Recommendations */}
      <Card sx={{ mt: 3, borderLeft: `4px solid ${recommendations.color}`, bgcolor: '#fafafa' }}>
        <CardContent>
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            {recommendations.icon}
            <Typography variant="h6" sx={{ color: recommendations.color, fontWeight: 'bold' }}>
              {recommendations.title}
            </Typography>
          </Box>
          
          <List dense>
            {recommendations.recommendations.map((rec, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemIcon sx={{ minWidth: 32 }}>
                  <Favorite sx={{ fontSize: 16, color: '#800000' }} />
                </ListItemIcon>
                <ListItemText 
                  primary={rec}
                  primaryTypographyProps={{ variant: 'body2' }}
                />
              </ListItem>
            ))}
          </List>

          {/* Sources */}
          <Box sx={{ mt: 2, p: 1, bgcolor: 'white', borderRadius: 1 }}>
            <Typography variant="caption" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              Sources: {recommendations.sources.join(', ')}
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Additional Health Tips */}
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#fff5f5' }}>
            <FitnessCenter sx={{ color: '#800000', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#800000' }}>
              Physical Activity
            </Typography>
            <Typography variant="caption" color="text.secondary">
              150 mins/week moderate exercise
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#f0fff4' }}>
            <LocalHospital sx={{ color: '#2e7d32', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#2e7d32' }}>
              Regular Checkups
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Annual health screenings
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ p: 2, textAlign: 'center', bgcolor: '#fffaf0' }}>
            <Warning sx={{ color: '#ed6c02', mb: 1 }} />
            <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#ed6c02' }}>
              Monitor Regularly
            </Typography>
            <Typography variant="caption" color="text.secondary">
              BP, glucose, cholesterol
            </Typography>
          </Card>
        </Grid>
      </Grid>

      {/* Medical Disclaimer */}
      <Box sx={{ mt: 2, p: 2, bgcolor: '#fff3cd', borderRadius: 1, border: '1px solid #ffeaa7' }}>
        <Typography variant="caption" sx={{ color: '#856404', fontStyle: 'italic' }}>
          <strong>Medical Disclaimer:</strong> These recommendations are based on general guidelines from reputable health organizations. 
          Always consult with qualified healthcare professionals for personalized medical advice. 
          In case of emergency symptoms (sudden numbness, confusion, vision problems, severe headache), seek immediate medical attention.
        </Typography>
      </Box>
    </Paper>
  );
};

export default PredictionCharts;