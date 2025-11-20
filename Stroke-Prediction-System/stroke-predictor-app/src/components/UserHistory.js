import React from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Chip,
  Box
} from '@mui/material';
import { History } from '@mui/icons-material';

const UserHistory = ({ history }) => {
  const getRiskColor = (probability) => {
    if (probability > 0.3) return 'error';
    if (probability > 0.15) return 'warning';
    return 'success';
  };

  return (
    <Paper elevation={3} sx={{ p: 3 }}>
      <Box display="flex" alignItems="center" gap={1} mb={2}>
        <History />
        <Typography variant="h5">Assessment History</Typography>
      </Box>

      {history.length === 0 ? (
        <Typography color="text.secondary" textAlign="center" sx={{ py: 4 }}>
          No assessments yet. Complete your first risk assessment to see history here.
        </Typography>
      ) : (
        <List>
          {history.map((item) => (
            <ListItem key={item.id} divider>
              <ListItemText
                primary={`Assessment on ${item.timestamp}`}
                secondary={`Age: ${item.formData.age} | Glucose: ${item.formData.avg_glucose_level} | BMI: ${item.formData.bmi}`}
              />
              <Chip
                label={`${(item.probability * 100).toFixed(1)}% Risk`}
                color={getRiskColor(item.probability)}
                variant="outlined"
              />
            </ListItem>
          ))}
        </List>
      )}
    </Paper>
  );
};

export default UserHistory;