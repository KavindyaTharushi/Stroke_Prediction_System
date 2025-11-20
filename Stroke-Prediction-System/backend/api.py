# ===== NUMPY FIX MUST BE AT THE VERY TOP =====
import sys
import os

# Apply numpy patch BEFORE any other imports
def apply_numpy_patch():
    try:
        import numpy as np
        if not hasattr(np, '_core'):
            # Multiple patch attempts
            if 'numpy.core' in sys.modules:
                np._core = sys.modules['numpy.core']
            else:
                import numpy.core
                np._core = numpy.core
        return True
    except Exception as e:
        print(f"⚠️ Numpy patch attempt failed: {e}")
        return False

# Apply patch immediately
apply_numpy_patch()

# Now import other packages
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
from typing import Dict, Any

PORT = int(os.getenv("PORT", 5000))

app = FastAPI(title="Stroke Prediction API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic model for request validation
class PatientData(BaseModel):
    age: float
    gender: str
    hypertension: int
    heart_disease: int
    ever_married: str
    work_type: str
    Residence_type: str
    avg_glucose_level: float
    bmi: float
    smoking_status: str

# Load model and preprocessing
try:
    # Double-check numpy patch
    if not hasattr(np, '_core'):
        print("🔧 Applying emergency numpy patch...")
        np._core = np.core
    
    model = joblib.load('stroke_model_advanced_20251002_161742.pkl')
    preprocessing = joblib.load('preprocessing_advanced_20251002_161742.pkl')
    print("✅ Model and preprocessing loaded successfully!")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    preprocessing = None

@app.get("/")
async def root():
    return {"message": "Stroke Prediction API is running!"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "model_loaded": model is not None}

@app.post("/predict")
async def predict_stroke(patient_data: PatientData):
    if model is None or preprocessing is None:
        raise HTTPException(status_code=500, detail="Model not loaded")
    
    try:
        # Convert to dict and then to DataFrame
        data = patient_data.model_dump()
        input_df = pd.DataFrame([data])
        
        # Create derived features (same as training)
        input_df['age_group'] = pd.cut(input_df['age'], bins=[0, 30, 50, 70, 100], 
                                    labels=['Young', 'Middle', 'Senior', 'Elderly'])
        input_df['bmi_category'] = pd.cut(input_df['bmi'], bins=[0, 18.5, 25, 30, 100], 
                                       labels=['Underweight', 'Normal', 'Overweight', 'Obese'])
        
        # Handle missing values
        num_cols = ['age', 'avg_glucose_level', 'bmi']
        input_df[num_cols] = preprocessing['imputer_num'].transform(input_df[num_cols])
        
        cat_cols = ['smoking_status']
        input_df[cat_cols] = preprocessing['imputer_cat'].transform(input_df[cat_cols])
        
        # Scale numerical features
        input_df[num_cols] = preprocessing['scaler'].transform(input_df[num_cols])
        
        # Encode categorical features
        categorical_mappings = {
            'gender': {'Male': 1, 'Female': 0},
            'ever_married': {'Yes': 1, 'No': 0},
            'work_type': {'Private': 2, 'Self-employed': 3, 'Govt_job': 0, 'children': 1, 'Never_worked': 4},
            'Residence_type': {'Urban': 1, 'Rural': 0},
            'smoking_status': {'never smoked': 1, 'formerly smoked': 2, 'smokes': 3},
            'age_group': {'Young': 3, 'Middle': 2, 'Senior': 1, 'Elderly': 0},
            'bmi_category': {'Underweight': 3, 'Normal': 2, 'Overweight': 1, 'Obese': 0}
        }
        
        for col, mapping in categorical_mappings.items():
            input_df[col] = input_df[col].map(mapping)
        
        # Ensure correct column order
        input_df = input_df[preprocessing['feature_columns']]
        
        # Predict with optimal threshold
        probability = model.predict_proba(input_df)[0][1]
        optimal_threshold = preprocessing.get('optimal_threshold', 0.5)
        prediction = 1 if probability > optimal_threshold else 0
        
        # Determine risk level
        if probability > 0.7:
            risk_level = 'HIGH'
            risk_color = '#dc2626'
        elif probability > 0.4:
            risk_level = 'MEDIUM'
            risk_color = '#ea580c'
        else:
            risk_level = 'LOW'
            risk_color = '#16a34a'
        
        return {
            'success': True,
            'prediction': prediction,
            'probability': probability,
            'risk_level': risk_level,
            'risk_color': risk_color,
            'threshold_used': optimal_threshold
        }
        
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Prediction error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=PORT)