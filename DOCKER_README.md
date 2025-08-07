# Squabdox Docker Deployment

This guide explains how to run the Squabdox AI Webapp Builder using Docker with a fully containerized setup, including local LLM support using OpenAI's open-source models.

## System Requirements

- Docker and Docker Compose
- At least 10GB of disk space for Docker images and LLM models
- For GPU acceleration (recommended):
  - NVIDIA GPU with CUDA support
  - NVIDIA Container Toolkit installed

## Quick Start

To get started quickly, run:

```bash
./run-docker.sh
```

This script will:
1. Check for Docker and Docker Compose
2. Start all services (backend, frontend, and LLM)
3. Pull the OpenAI OSS model (first run will take several minutes)
4. Show combined logs from all services

Once everything is running, access the UI at http://localhost:5173

## Manual Deployment

If you prefer to run commands manually or deploy to a cloud environment:

```bash
# Start all services in the background
docker-compose up -d

# Wait for Ollama to be ready, then pull the model
docker-compose exec llm ollama pull openai-oss:latest

# View logs
docker-compose logs -f
```

## Cloud Deployment

For cloud deployment, use the provided deployment script:

```bash
./deploy.sh [environment] [gpu-flag]
```

Examples:
- Deploy to production with GPU: `./deploy.sh production "--gpus all"`
- Deploy to staging without GPU: `./deploy.sh staging ""`

## Components

The Docker setup consists of three main services:

1. **LLM Service (Ollama)**
   - Runs the local LLM server
   - Uses OpenAI's open-source models
   - Accessible at http://localhost:11434

2. **Backend API**
   - FastAPI server for project generation
   - Communicates with the LLM service
   - Accessible at http://localhost:8000

3. **Frontend**
   - React-based UI for the Squabdox app
   - Communicates with the Backend API
   - Accessible at http://localhost:5173

## GPU Support

The system will automatically use GPU acceleration if available. To verify GPU usage:

```bash
docker-compose exec llm nvidia-smi
```

## Troubleshooting

If you encounter issues:

1. **Model download errors**: 
   - Run `docker-compose logs llm` to check download progress
   - Ensure sufficient disk space (at least 10GB free)

2. **Connection errors**:
   - Check that all services are running: `docker-compose ps`
   - Ensure ports 8000, 5173, and 11434 are available

3. **No GPU acceleration**:
   - Verify NVIDIA drivers are installed: `nvidia-smi`
   - Check NVIDIA Container Toolkit is installed