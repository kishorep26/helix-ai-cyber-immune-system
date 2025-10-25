#!/bin/bash

echo "========================================"
echo "AI Cyber Immune Network Deployment"
echo "========================================"
echo ""

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "ERROR: Docker is not installed"
    echo "Please install Docker from https://www.docker.com/"
    exit 1
fi

echo "Step 1: Building Docker image..."
docker build -t ai-cyber-immune-network:latest .

if [ $? -ne 0 ]; then
    echo "ERROR: Docker build failed"
    exit 1
fi

echo ""
echo "Step 2: Stopping existing container (if running)..."
docker stop ai-cyber-immune-dashboard 2>/dev/null || true
docker rm ai-cyber-immune-dashboard 2>/dev/null || true

echo ""
echo "Step 3: Starting new container..."
docker run -d \
  --name ai-cyber-immune-dashboard \
  -p 8501:8501 \
  -v $(pwd)/models:/app/models \
  -v $(pwd)/data:/app/data \
  --restart unless-stopped \
  ai-cyber-immune-network:latest

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to start container"
    exit 1
fi

echo ""
echo "========================================"
echo "Deployment Complete!"
echo "========================================"
echo ""
echo "Dashboard URL: http://localhost:8501"
echo ""
echo "Useful Commands:"
echo "  View logs:    docker logs -f ai-cyber-immune-dashboard"
echo "  Stop:         docker stop ai-cyber-immune-dashboard"
echo "  Restart:      docker restart ai-cyber-immune-dashboard"
echo "  Remove:       docker rm -f ai-cyber-immune-dashboard"
echo ""
echo "Container Status:"
docker ps | grep ai-cyber-immune-dashboard
echo ""
echo "========================================"
