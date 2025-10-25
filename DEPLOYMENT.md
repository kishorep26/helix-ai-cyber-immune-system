
# Deployment Guide
## Advanced Self-Healing AI Cyber Immune Network

---

## Table of Contents
1. [Local Deployment](#local-deployment)
2. [Cloud Deployment](#cloud-deployment)
3. [Monitoring](#monitoring)
4. [Troubleshooting](#troubleshooting)

---

## Local Deployment

### Prerequisites
- Docker 20.10 or later
- 4GB RAM minimum
- 10GB disk space

### Quick Start

**Option 1: Using deployment script (recommended)**
./deploy.sh



**Option 2: Using Docker Compose**
docker-compose up -d



**Option 3: Manual Docker run**
docker build -t ai-cyber-immune-network .
docker run -d -p 8501:8501 --name ai-cyber-immune ai-cyber-immune-network



### Access Dashboard
Open browser to: `http://localhost:8501`

---

## Cloud Deployment

### AWS Deployment

#### Method 1: AWS ECS (Elastic Container Service)

**Step 1: Create ECR Repository**
aws ecr create-repository --repository-name ai-cyber-immune



**Step 2: Authenticate Docker to ECR**
aws ecr get-login-password --region us-east-1 |
docker login --username AWS --password-stdin
<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com



**Step 3: Build and Push Image**
docker build -t ai-cyber-immune .
docker tag ai-cyber-immune:latest
<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ai-cyber-immune:latest
docker push <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ai-cyber-immune:latest



**Step 4: Create ECS Task Definition**
{
"family": "ai-cyber-immune",
"networkMode": "awsvpc",
"requiresCompatibilities": ["FARGATE"],
"cpu": "1024",
"memory": "2048",
"containerDefinitions": [
{
"name": "dashboard",
"image": "<ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com/ai-cyber-immune:latest",
"portMappings": [
{
"containerPort": 8501,
"protocol": "tcp"
}
]
}
]
}



**Step 5: Create ECS Service**
aws ecs create-service
--cluster default
--service-name ai-cyber-immune-service
--task-definition ai-cyber-immune
--desired-count 1
--launch-type FARGATE



#### Method 2: AWS EC2

**Step 1: Launch EC2 Instance**
- AMI: Amazon Linux 2
- Instance Type: t3.medium
- Security Group: Allow port 8501

**Step 2: SSH into instance and install Docker**
sudo yum update -y
sudo yum install docker -y
sudo service docker start
sudo usermod -a -G docker ec2-user



**Step 3: Deploy container**
docker run -d -p 8501:8501 ai-cyber-immune-network



---

### Google Cloud Platform Deployment

#### Using Cloud Run

**Step 1: Enable Cloud Run API**
gcloud services enable run.googleapis.com



**Step 2: Build and submit to Container Registry**
gcloud builds submit --tag gcr.io/PROJECT-ID/ai-cyber-immune



**Step 3: Deploy to Cloud Run**
gcloud run deploy ai-cyber-immune
--image gcr.io/PROJECT-ID/ai-cyber-immune
--platform managed
--region us-central1
--allow-unauthenticated
--memory 2Gi
--cpu 1



**Step 4: Get service URL**
gcloud run services describe ai-cyber-immune --region us-central1



---

### Azure Deployment

#### Using Azure Container Instances

**Step 1: Login to Azure**
az login



**Step 2: Create resource group**
az group create
--name ai-cyber-immune-rg
--location eastus



**Step 3: Create container registry**
az acr create
--resource-group ai-cyber-immune-rg
--name aicyberimmune
--sku Basic



**Step 4: Build and push image**
az acr build
--registry aicyberimmune
--image ai-cyber-immune:latest .



**Step 5: Deploy container**
az container create
--resource-group ai-cyber-immune-rg
--name ai-cyber-immune
--image aicyberimmune.azurecr.io/ai-cyber-immune:latest
--dns-name-label ai-cyber-immune-dashboard
--ports 8501
--cpu 1
--memory 2



---

### Heroku Deployment (Free Tier)

**Step 1: Install Heroku CLI**
macOS
brew install heroku/brew/heroku

Ubuntu
curl https://cli-assets.heroku.com/install.sh | sh



**Step 2: Login and create app**
heroku login
heroku create ai-cyber-immune-network



**Step 3: Set to container stack**
heroku stack:set container -a ai-cyber-immune-network



**Step 4: Deploy**
git add .
git commit -m "Deploy to Heroku"
git push heroku main



**Step 5: Open app**
heroku open -a ai-cyber-immune-network



---

## Monitoring

### View Logs
Docker
docker logs -f ai-cyber-immune-dashboard

Docker Compose
docker-compose logs -f

AWS ECS
aws logs tail /ecs/ai-cyber-immune --follow

GCP Cloud Run
gcloud logging read "resource.type=cloud_run_revision" --limit 50

Azure
az container logs --resource-group ai-cyber-immune-rg --name ai-cyber-immune



### Check Container Status
docker ps | grep ai-cyber-immune
docker stats ai-cyber-immune-dashboard



### Health Check
curl http://localhost:8501/_stcore/health



---

## Troubleshooting

### Container Won't Start
Check logs
docker logs ai-cyber-immune-dashboard

Verify image exists
docker images | grep ai-cyber-immune

Check port availability
lsof -i :8501



### Out of Memory
Increase Docker memory limit
docker run -d -p 8501:8501 -m 4g ai-cyber-immune-network



### Port Already in Use
Kill process using port 8501
lsof -ti:8501 | xargs kill -9

Or use different port
docker run -d -p 8080:8501 ai-cyber-immune-network



### Model Files Missing
Mount models directory
docker run -d -p 8501:8501
-v $(pwd)/models:/app/models
ai-cyber-immune-network



---

## Performance Optimization

### Use GPU (NVIDIA)
docker run -d -p 8501:8501
--gpus all
ai-cyber-immune-network



### Scale with Kubernetes
kubectl apply -f k8s-deployment.yaml
kubectl scale deployment ai-cyber-immune --replicas=3



### Load Balancing
- Use AWS ELB
- Use GCP Load Balancer
- Use Azure Load Balancer
- Use nginx reverse proxy

---

## Security Best Practices

1. **Use HTTPS**: Always deploy with SSL/TLS certificates
2. **Authentication**: Add user authentication layer
3. **Secrets Management**: Use environment variables for sensitive data
4. **Network Isolation**: Deploy in private VPC/subnet
5. **Regular Updates**: Keep dependencies updated
6. **Monitoring**: Set up logging and alerts
7. **Backup**: Regular backup of models and data

---

## Support

For issues, please create an issue on GitHub or contact the maintainer.

**Author**: Kishore Prashanth  
**Project**: Advanced Self-Healing AI Cyber Immune Network