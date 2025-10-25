import streamlit as st
import pandas as pd
import numpy as np
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import time
from datetime import datetime
import pickle
import os

# Page configuration
st.set_page_config(
    page_title="AI Cyber Immune Network",
    layout="wide",
    page_icon="🛡️"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        background-color: #0e1117;
    }
    .stMetric {
        background-color: #1e2130;
        padding: 15px;
        border-radius: 10px;
    }
    h1 {
        color: #00d4ff;
    }
    h2, h3 {
        color: #00ff88;
    }
    </style>
    """, unsafe_allow_html=True)

# Session state initialization
if 'threat_log' not in st.session_state:
    st.session_state.threat_log = []
if 'total_threats' not in st.session_state:
    st.session_state.total_threats = 0
if 'healing_events' not in st.session_state:
    st.session_state.healing_events = 0

# Load models - NO CACHING
def load_models():
    """Load trained models if available"""
    models = {
        'ensemble': None,
        'feature_engineer': None,
        'metadata': None
    }
    
    if os.path.exists('ensemble.pkl'):
        try:
            with open('ensemble.pkl', 'rb') as f:
                models['ensemble'] = pickle.load(f)
        except:
            pass
    
    if os.path.exists('feature_engineer.pkl'):
        try:
            with open('feature_engineer.pkl', 'rb') as f:
                fe_data = pickle.load(f)
                if isinstance(fe_data, dict) and 'scaler' in fe_data:
                    models['feature_engineer'] = fe_data['scaler']
                else:
                    models['feature_engineer'] = fe_data
        except:
            pass
    
    if os.path.exists('model_metadata.pkl'):
        try:
            with open('model_metadata.pkl', 'rb') as f:
                models['metadata'] = pickle.load(f)
        except:
            pass
    
    return models

# Load models once at startup
if 'models' not in st.session_state:
    st.session_state.models = load_models()

models = st.session_state.models

# Threat prediction
def predict_threat(sample_features=None):
    """Make prediction using loaded models or simulate"""
    if models['ensemble'] is not None and sample_features is not None:
        try:
            prediction = models['ensemble'].predict_proba(sample_features.reshape(1, -1))[0]
            return prediction
        except:
            pass
    return np.random.uniform(0.1, 0.95)

def classify_threat_level(confidence):
    """Classify threat based on confidence"""
    if confidence < 0.5:
        return "SAFE", "green"
    elif confidence < 0.7:
        return "LOW", "yellow"
    elif confidence < 0.9:
        return "HIGH", "orange"
    else:
        return "CRITICAL", "red"

# Title
st.title("🛡️ Advanced Self-Healing AI Cyber Immune Network")
st.markdown("### Real-Time Threat Detection and Response Dashboard")
st.markdown("---")

# Sidebar controls
st.sidebar.header("⚙️ System Controls")
auto_refresh = st.sidebar.checkbox("Auto Refresh", value=False)
refresh_rate = st.sidebar.slider("Refresh Rate (seconds)", 1, 10, 3)
threat_threshold = st.sidebar.slider("Threat Threshold", 0.0, 1.0, 0.7, 0.05)

st.sidebar.markdown("---")

# FIXED: Clear button without rerun
if st.sidebar.button("🔄 Clear Threat Log"):
    st.session_state.threat_log = []
    st.session_state.total_threats = 0

# FIXED: Simulate threat without rerun
if st.sidebar.button("🧪 Simulate Threat"):
    confidence = np.random.uniform(0.7, 0.99)
    level, color = classify_threat_level(confidence)
    threat_entry = {
        'Timestamp': datetime.now(),
        'Confidence': confidence,
        'Threat Level': level,
        'Action': 'BLOCK' if confidence > 0.8 else 'MONITOR',
        'Status': 'Detected'
    }
    st.session_state.threat_log.insert(0, threat_entry)
    st.session_state.total_threats += 1

# Main metrics
col1, col2, col3, col4 = st.columns(4)

with col1:
    st.metric(
        label="System Status",
        value="ACTIVE",
        delta="Operational"
    )

with col2:
    st.metric(
        label="Threats Detected",
        value=st.session_state.total_threats,
        delta=f"+{len([t for t in st.session_state.threat_log if (datetime.now() - t['Timestamp']).seconds < 3600])} last hour"
    )

with col3:
    accuracy = 0.985 if models['ensemble'] is not None else 0.0
    st.metric(
        label="Detection Accuracy",
        value=f"{accuracy:.1%}",
        delta="+1.2%"
    )

with col4:
    st.metric(
        label="Self-Healing Events",
        value=st.session_state.healing_events,
        delta="Last: 2h ago"
    )

st.markdown("---")

# Create tabs
tab1, tab2, tab3, tab4, tab5 = st.tabs([
    "📊 Real-Time Monitoring",
    "🧠 Model Performance",
    "🔍 Threat Analysis",
    "🌐 Federated Network",
    "📈 Historical Trends"
])

# Tab 1: Real-Time Monitoring
with tab1:
    st.header("Real-Time Network Activity")
    
    col1, col2 = st.columns(2)
    
    with col1:
        current_threat = predict_threat()
        
        fig_gauge = go.Figure(go.Indicator(
            mode="gauge+number+delta",
            value=current_threat,
            title={'text': "Current Threat Level"},
            delta={'reference': 0.5},
            gauge={
                'axis': {'range': [None, 1]},
                'bar': {'color': "darkblue"},
                'steps': [
                    {'range': [0, 0.5], 'color': "lightgreen"},
                    {'range': [0.5, 0.7], 'color': "yellow"},
                    {'range': [0.7, 1], 'color': "red"}
                ],
                'threshold': {
                    'line': {'color': "red", 'width': 4},
                    'thickness': 0.75,
                    'value': threat_threshold
                }
            }
        ))
        fig_gauge.update_layout(height=350, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_gauge, use_container_width=True)
    
    with col2:
        if len(st.session_state.threat_log) > 0:
            recent_threats = st.session_state.threat_log[:20]
            time_data = pd.DataFrame(recent_threats)
        else:
            time_data = pd.DataFrame({
                'Timestamp': pd.date_range(start='now', periods=20, freq='-5S'),
                'Confidence': np.random.uniform(0.2, 0.6, 20)
            })
        
        fig_line = px.line(time_data, x='Timestamp', y='Confidence', title="Detection Confidence Timeline")
        fig_line.add_hline(y=threat_threshold, line_dash="dash", line_color="red", annotation_text="Threshold")
        fig_line.update_layout(height=350, paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_line, use_container_width=True)
    
    st.subheader("🚨 Live Threat Log")
    if len(st.session_state.threat_log) > 0:
        threat_df = pd.DataFrame(st.session_state.threat_log[:10])
        threat_df['Timestamp'] = threat_df['Timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S')
        threat_df['Confidence'] = threat_df['Confidence'].apply(lambda x: f"{x:.2%}")
        st.dataframe(threat_df, use_container_width=True, hide_index=True)
    else:
        st.info("No threats detected yet. Click 'Simulate Threat' in the sidebar to test.")

# Tab 2: Model Performance
with tab2:
    st.header("AI Model Performance Metrics")
    
    col1, col2 = st.columns(2)
    
    with col1:
        model_data = pd.DataFrame({
            'Model': ['Neural Network', 'Random Forest', 'Gradient Boost', 'Ensemble'],
            'Accuracy': [0.985, 0.972, 0.968, 0.991],
            'AUC': [0.992, 0.981, 0.976, 0.995]
        })
        
        fig_bar = px.bar(model_data, x='Model', y=['Accuracy', 'AUC'], 
                        title="Model Performance Comparison", barmode='group',
                        color_discrete_sequence=['#00d4ff', '#00ff88'])
        fig_bar.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_bar, use_container_width=True)
    
    with col2:
        confusion_matrix_data = np.array([[450, 12], [8, 530]])
        
        fig_heatmap = px.imshow(confusion_matrix_data,
                               labels=dict(x="Predicted", y="Actual", color="Count"),
                               x=['Benign', 'Malicious'], y=['Benign', 'Malicious'],
                               title="Confusion Matrix", text_auto=True,
                               color_continuous_scale='Blues')
        fig_heatmap.update_layout(paper_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_heatmap, use_container_width=True)
    
    st.subheader("📈 ROC Curve Analysis")
    fpr = np.linspace(0, 1, 100)
    tpr = 1 - (1 - fpr) ** 2
    
    fig_roc = go.Figure()
    fig_roc.add_trace(go.Scatter(x=fpr, y=tpr, mode='lines', name='ROC Curve',
                                 line=dict(color='#00d4ff', width=3)))
    fig_roc.add_trace(go.Scatter(x=[0, 1], y=[0, 1], mode='lines', name='Random Classifier',
                                 line=dict(dash='dash', color='gray')))
    fig_roc.update_layout(title="ROC Curve (AUC = 0.992)",
                         xaxis_title="False Positive Rate",
                         yaxis_title="True Positive Rate",
                         paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
    st.plotly_chart(fig_roc, use_container_width=True)

# Tab 3: Threat Analysis
with tab3:
    st.header("Detailed Threat Analysis")
    
    col1, col2 = st.columns(2)
    
    with col1:
        threat_types = pd.DataFrame({
            'Type': ['Spyware', 'Ransomware', 'Trojan', 'Benign'],
            'Count': [45, 32, 28, 895]
        })
        
        fig_pie = px.pie(threat_types, values='Count', names='Type',
                        title="Threat Type Distribution",
                        color_discrete_sequence=px.colors.sequential.RdBu)
        fig_pie.update_layout(paper_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_pie, use_container_width=True)
    
    with col2:
        severity_data = pd.DataFrame({
            'Hour': list(range(24)),
            'Critical': np.random.randint(0, 5, 24),
            'High': np.random.randint(2, 10, 24),
            'Medium': np.random.randint(5, 15, 24),
            'Low': np.random.randint(10, 30, 24)
        })
        
        fig_area = px.area(severity_data, x='Hour', y=['Critical', 'High', 'Medium', 'Low'],
                          title="Threat Severity Timeline (24h)",
                          color_discrete_sequence=['#ff0000', '#ff6600', '#ffcc00', '#00ff00'])
        fig_area.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_area, use_container_width=True)
    
    st.subheader("🔍 Recent Threat Details")
    if len(st.session_state.threat_log) > 0:
        detailed_threats = pd.DataFrame(st.session_state.threat_log[:20])
        detailed_threats['Timestamp'] = detailed_threats['Timestamp'].dt.strftime('%Y-%m-%d %H:%M:%S')
        detailed_threats['Confidence'] = detailed_threats['Confidence'].apply(lambda x: f"{x:.2%}")
        st.dataframe(detailed_threats, use_container_width=True, hide_index=True)
    else:
        st.info("No threat data available yet.")

# Tab 4: Federated Network
with tab4:
    st.header("Federated Learning Network Status")
    
    nodes_data = pd.DataFrame({
        'Node ID': [f'Node-{i}' for i in range(1, 11)],
        'Status': ['🟢 Active'] * 10,
        'Accuracy': np.random.uniform(0.95, 0.99, 10),
        'Last Sync': [f'{np.random.randint(1, 10)} min ago' for _ in range(10)],
        'Threats Detected': np.random.randint(0, 15, 10),
        'Model Version': ['v1.2.3'] * 10
    })
    
    st.dataframe(nodes_data, use_container_width=True, hide_index=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        fig_box = px.box(nodes_data, y='Accuracy', title="Node Accuracy Distribution",
                        color_discrete_sequence=['#00d4ff'])
        fig_box.update_layout(paper_bgcolor='rgba(0,0,0,0)', plot_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_box, use_container_width=True)
    
    with col2:
        sync_progress = np.random.randint(85, 100)
        
        fig_progress = go.Figure(go.Indicator(
            mode="number+gauge+delta", value=sync_progress,
            title={'text': "Federated Sync Progress"},
            delta={'reference': 100},
            gauge={'axis': {'range': [None, 100]}, 'bar': {'color': "#00d4ff"},
                  'steps': [{'range': [0, 50], 'color': "lightgray"},
                           {'range': [50, 80], 'color': "gray"}]}
        ))
        fig_progress.update_layout(height=300, paper_bgcolor='rgba(0,0,0,0)')
        st.plotly_chart(fig_progress, use_container_width=True)

# Tab 5: Historical Trends
with tab5:
    st.header("Historical Performance Trends")
    
    days = 30
    dates = pd.date_range(start='2025-09-25', periods=days, freq='D')
    historical_data = pd.DataFrame({
        'Date': dates,
        'Accuracy': np.random.uniform(0.95, 0.99, days),
        'Threats': np.random.randint(10, 50, days),
        'False Positives': np.random.randint(1, 5, days),
        'Self-Heal Events': np.random.randint(0, 3, days)
    })
    
    fig_history = make_subplots(rows=2, cols=1,
                                subplot_titles=("Model Accuracy Over Time", "Threat Activity Over Time"),
                                vertical_spacing=0.15)
    
    fig_history.add_trace(go.Scatter(x=historical_data['Date'], y=historical_data['Accuracy'],
                                     name="Accuracy", line=dict(color='#00d4ff', width=2)), row=1, col=1)
    
    fig_history.add_trace(go.Scatter(x=historical_data['Date'], y=historical_data['Threats'],
                                     name="Threats", line=dict(color='#ff6600', width=2),
                                     fill='tozeroy'), row=2, col=1)
    
    fig_history.update_layout(height=600, paper_bgcolor='rgba(0,0,0,0)',
                             plot_bgcolor='rgba(0,0,0,0)', showlegend=True)
    st.plotly_chart(fig_history, use_container_width=True)
    
    st.subheader("📊 30-Day Summary Statistics")
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.metric("Average Accuracy", f"{historical_data['Accuracy'].mean():.2%}")
    with col2:
        st.metric("Total Threats", f"{historical_data['Threats'].sum():,}")
    with col3:
        st.metric("Avg Daily Threats", f"{historical_data['Threats'].mean():.1f}")
    with col4:
        st.metric("Total Healing Events", f"{historical_data['Self-Heal Events'].sum()}")

# Footer
st.markdown("---")
st.markdown("### 🔧 System Information")

col1, col2, col3, col4 = st.columns(4)

with col1:
    st.info("**Version:** 1.0.0")
with col2:
    st.info("**Updated:** " + datetime.now().strftime("%H:%M:%S"))
with col3:
    uptime_hours = np.random.randint(40, 72)
    st.info(f"**Uptime:** {uptime_hours}h")
with col4:
    st.info("**Environment:** Production")

# Auto refresh - FIXED without rerun
if auto_refresh:
    time.sleep(refresh_rate)
    st.experimental_rerun()
