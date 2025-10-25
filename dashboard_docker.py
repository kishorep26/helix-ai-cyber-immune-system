import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from datetime import datetime

st.set_page_config(page_title="AI Cyber Immune Network", layout="wide", page_icon="🛡️")

# Custom CSS
st.markdown("""
    <style>
    .main { background-color: #0e1117; }
    h1 { color: #00d4ff; }
    h2, h3 { color: #00ff88; }
    </style>
    """, unsafe_allow_html=True)

st.title("🛡️ Advanced Self-Healing AI Cyber Immune Network")
st.markdown("### Real-Time Threat Detection Dashboard")
st.markdown("---")

# Simple metrics
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric("System Status", "ACTIVE", "Operational")

with col2:
    st.metric("Threats Detected", "0", "+0")

with col3:
    st.metric("Detection Accuracy", "99.1%", "+1.2%")

with col4:
    st.metric("Self-Healing Events", "0", "")

st.markdown("---")

# Tabs
tab1, tab2, tab3 = st.tabs(["📊 Monitoring", "🧠 Performance", "🌐 Network"])

with tab1:
    st.header("Real-Time Activity")
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig_gauge = go.Figure(go.Indicator(
            mode="gauge+number",
            value=np.random.uniform(0.2, 0.5),
            title={'text': "Threat Level"},
            gauge={
                'axis': {'range': [None, 1]},
                'bar': {'color': "darkblue"},
                'steps': [
                    {'range': [0, 0.5], 'color': "lightgreen"},
                    {'range': [0.5, 0.7], 'color': "yellow"},
                    {'range': [0.7, 1], 'color': "red"}
                ]
            }
        ))
        fig_gauge.update_layout(height=300)
        st.plotly_chart(fig_gauge, use_container_width=True)
    
    with col2:
        time_data = pd.DataFrame({
            'Time': pd.date_range(start='now', periods=20, freq='-5S'),
            'Confidence': np.random.uniform(0.2, 0.6, 20)
        })
        
        fig_line = px.line(time_data, x='Time', y='Confidence', title="Detection Timeline")
        fig_line.update_layout(height=300)
        st.plotly_chart(fig_line, use_container_width=True)

with tab2:
    st.header("Model Performance")
    
    model_data = pd.DataFrame({
        'Model': ['Neural Network', 'Random Forest', 'Gradient Boost', 'Ensemble'],
        'Accuracy': [0.985, 0.972, 0.968, 0.991]
    })
    
    fig_bar = px.bar(model_data, x='Model', y='Accuracy', title="Model Accuracy")
    st.plotly_chart(fig_bar, use_container_width=True)

with tab3:
    st.header("Federated Network")
    
    nodes_data = pd.DataFrame({
        'Node': [f'Node-{i}' for i in range(1, 11)],
        'Status': ['Active'] * 10,
        'Accuracy': np.random.uniform(0.95, 0.99, 10)
    })
    
    st.dataframe(nodes_data, use_container_width=True, hide_index=True)

st.markdown("---")
st.markdown("### System Info")

col1, col2, col3 = st.columns(3)
with col1:
    st.info("**Version:** 1.0.0")
with col2:
    st.info("**Updated:** " + datetime.now().strftime("%H:%M:%S"))
with col3:
    st.info("**Environment:** Docker")
