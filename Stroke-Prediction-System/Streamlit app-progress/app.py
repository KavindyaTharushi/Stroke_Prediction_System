"""
import streamlit as st
import joblib
import pandas as pd
import numpy as np

# Load model and preprocessing
@st.cache_resource
def load_model():
    model = joblib.load('stroke_model_20251002_131633.pkl') 
    preprocessing = joblib.load('preprocessing_20251002_131633.pkl')  
    return model, preprocessing

def predict_stroke(input_data):
    model, preprocessing = load_model()
    
    # Convert to DataFrame
    input_df = pd.DataFrame([input_data])
    
    # Create age_group and bmi_category (same as training)
    input_df['age_group'] = pd.cut(input_df['age'], bins=[0, 30, 50, 70, 100], 
                                labels=['Young', 'Middle', 'Senior', 'Elderly'])
    input_df['bmi_category'] = pd.cut(input_df['bmi'], bins=[0, 18.5, 25, 30, 100], 
                                   labels=['Underweight', 'Normal', 'Overweight', 'Obese'])
    
    # Scale numerical features
    num_cols = ['age', 'avg_glucose_level', 'bmi']
    input_df[num_cols] = preprocessing['scaler'].transform(input_df[num_cols])
    
    # Encode ALL categorical features including the new ones
    categorical_mappings = {
        'gender': {'Male': 1, 'Female': 0},
        'ever_married': {'Yes': 1, 'No': 0},
        'work_type': {'Private': 2, 'Self-employed': 3, 'Govt_job': 0, 'children': 1, 'Never_worked': 4},
        'Residence_type': {'Urban': 1, 'Rural': 0},
        'smoking_status': {'never smoked': 1, 'formerly smoked': 2, 'smokes': 3},
        'age_group': {'Young': 3, 'Middle': 2, 'Senior': 1, 'Elderly': 0},  # Add this
        'bmi_category': {'Underweight': 3, 'Normal': 2, 'Overweight': 1, 'Obese': 0}  # Add this
    }
    
    for col, mapping in categorical_mappings.items():
        if col in input_df.columns:
            input_df[col] = input_df[col].map(mapping)
    
    # Ensure correct column order (all features used in training)
    input_df = input_df[preprocessing['feature_columns']]
    
    # Predict
    prediction = model.predict(input_df)[0]
    probability = model.predict_proba(input_df)[0][1]
    
    return prediction, probability

# Streamlit UI
st.title("Stroke Prediction App")

# Input form
with st.form("prediction_form"):
    age = st.number_input("Age", min_value=0, max_value=120, value=50)
    gender = st.selectbox("Gender", ["Male", "Female"])
    hypertension = st.selectbox("Hypertension", [0, 1])
    heart_disease = st.selectbox("Heart Disease", [0, 1])
    avg_glucose_level = st.number_input("Average Glucose Level", min_value=50.0, max_value=300.0, value=100.0)
    bmi = st.number_input("BMI", min_value=10.0, max_value=70.0, value=25.0)
    smoking_status = st.selectbox("Smoking Status", ["never smoked", "formerly smoked", "smokes"])
    ever_married = st.selectbox("Ever Married", ["Yes", "No"])
    work_type = st.selectbox("Work Type", ["Private", "Self-employed", "Govt_job", "children", "Never_worked"])
    residence_type = st.selectbox("Residence Type", ["Urban", "Rural"])
    
    submitted = st.form_submit_button("Predict Stroke Risk")
    
    if submitted:
        input_data = {
            'gender': gender,
            'age': age,
            'hypertension': hypertension,
            'heart_disease': heart_disease,
            'ever_married': ever_married,
            'work_type': work_type,
            'Residence_type': residence_type,
            'avg_glucose_level': avg_glucose_level,
            'bmi': bmi,
            'smoking_status': smoking_status
        }
        
        prediction, probability = predict_stroke(input_data)
        
        if prediction == 1:
            st.error(f"🚨 High stroke risk detected! Probability: {probability:.1%}")
        else:
            st.success(f"✅ Low stroke risk. Probability: {probability:.1%}")

            """


import streamlit as st
import joblib
import pandas as pd
import numpy as np

# Load model and preprocessing
@st.cache_resource
def load_model():
    model = joblib.load('stroke_model_20251002_131633.pkl')
    preprocessing = joblib.load('preprocessing_20251002_131633.pkl')
    return model, preprocessing

def predict_stroke(input_data):
    model, preprocessing = load_model()
    
    # Convert to DataFrame
    input_df = pd.DataFrame([input_data])
    
    # Create age_group and bmi_category
    input_df['age_group'] = pd.cut(input_df['age'], bins=[0, 30, 50, 70, 100], 
                                labels=['Young', 'Middle', 'Senior', 'Elderly'])
    input_df['bmi_category'] = pd.cut(input_df['bmi'], bins=[0, 18.5, 25, 30, 100], 
                                   labels=['Underweight', 'Normal', 'Overweight', 'Obese'])
    
    # Scale numerical features
    num_cols = ['age', 'avg_glucose_level', 'bmi']
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
        if col in input_df.columns:
            input_df[col] = input_df[col].map(mapping)
    
    # Ensure correct column order
    input_df = input_df[preprocessing['feature_columns']]
    
    # Get probability
    probability = model.predict_proba(input_df)[0][1]
    
    # 🚨 ADJUSTED THRESHOLD - Use 0.2 instead of 0.5 for high risk
    prediction = 1 if probability > 0.2 else 0
    
    return prediction, probability

# Streamlit UI
st.title("Stroke Prediction App")

# Input form
with st.form("prediction_form"):
    age = st.number_input("Age", min_value=0, max_value=120, value=80)
    gender = st.selectbox("Gender", ["Male", "Female"])
    hypertension = st.selectbox("Hypertension", [0, 1], format_func=lambda x: "Yes" if x == 1 else "No")
    heart_disease = st.selectbox("Heart Disease", [0, 1], format_func=lambda x: "Yes" if x == 1 else "No")
    avg_glucose_level = st.number_input("Average Glucose Level", min_value=50.0, max_value=300.0, value=280.0)
    bmi = st.number_input("BMI", min_value=10.0, max_value=70.0, value=45.0)
    smoking_status = st.selectbox("Smoking Status", ["never smoked", "formerly smoked", "smokes"])
    ever_married = st.selectbox("Ever Married", ["Yes", "No"])
    work_type = st.selectbox("Work Type", ["Private", "Self-employed", "Govt_job", "children", "Never_worked"])
    residence_type = st.selectbox("Residence Type", ["Urban", "Rural"])
    
    submitted = st.form_submit_button("Predict Stroke Risk")
    
    if submitted:
        input_data = {
            'gender': gender,
            'age': age,
            'hypertension': hypertension,
            'heart_disease': heart_disease,
            'ever_married': ever_married,
            'work_type': work_type,
            'Residence_type': residence_type,
            'avg_glucose_level': avg_glucose_level,
            'bmi': bmi,
            'smoking_status': smoking_status
        }
        
        prediction, probability = predict_stroke(input_data)
        
        # 🚨 ADJUSTED RISK LEVELS
        if probability > 0.3:
            risk_level = "🚨 HIGH RISK"
            color = "red"
        elif probability > 0.15:
            risk_level = "⚠️ MEDIUM RISK" 
            color = "orange"
        else:
            risk_level = "✅ LOW RISK"
            color = "green"
        
        st.markdown(f"<h3 style='color: {color};'>{risk_level}</h3>", unsafe_allow_html=True)
        st.write(f"**Stroke Probability:** {probability:.1%}")
        
        if prediction == 1:
            st.error("""
            **Medical Attention Recommended**
            - Consult healthcare provider
            - Monitor vital signs regularly
            - Consider preventive measures
            """)
        else:
            st.success("""
            **Continue Healthy Habits**
            - Regular checkups recommended
            - Maintain current lifestyle
            """)