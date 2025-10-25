# Use official Python runtime as base image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements file
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY . .

# Expose port for Streamlit dashboard
EXPOSE 8501

# Set environment variables
ENV PYTHONUNBUFFERED=1

# Run dashboard by default
CMD ["streamlit", "run", "dashboard_integrated.py", "--server.port=8501", "--server.address=0.0.0.0"]
