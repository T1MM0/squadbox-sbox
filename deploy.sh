#!/bin/bash

# Deploy script for Squadbox in cloud environments

# Set default variables
DEPLOYMENT_ENV=${1:-"production"}
GPU_FLAG=${2:-"--gpus all"}  # Use '--gpus all' for GPU support, empty for CPU only

# Show usage information
usage() {
    echo "Usage: $0 [environment] [gpu-flag]"
    echo ""
    echo "Environment:"
    echo "  development    Development environment (default)"
    echo "  staging        Staging environment"
    echo "  production     Production environment"
    echo ""
    echo "GPU Flag:"
    echo "  --gpus all     Use GPU (default)"
    echo "  \"\"            CPU only (empty string)"
    echo ""
    echo "Example:"
    echo "  $0 production \"--gpus all\""
    exit 1
}

# Parse arguments
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    usage
fi

echo "====================================================="
echo "Deploying Squadbox to $DEPLOYMENT_ENV environment"
echo "GPU support: ${GPU_FLAG:-"No"}"
echo "====================================================="

# Build the container images
echo "Building container images..."
docker-compose build

# Pull the latest Ollama image
echo "Pulling latest Ollama image..."
docker pull ollama/ollama:latest

# Start the services
echo "Starting services..."

# GPU detection and handling
if [ -n "$GPU_FLAG" ]; then
    # Check if NVIDIA drivers are available
    if ! command -v nvidia-smi &> /dev/null; then
        echo "WARNING: GPU flag set but NVIDIA drivers not found."
        echo "Will try to start with GPU support, but may fail."
    else
        echo "NVIDIA GPU detected. Starting with GPU support."
        nvidia-smi
    fi
    docker-compose up -d $GPU_FLAG
else
    echo "Starting in CPU-only mode (will be much slower)."
    docker-compose up -d
fi

# Wait for Ollama container to be ready
echo "Waiting for Ollama to start..."
until docker-compose exec -T llm curl -s --retry 5 --retry-delay 2 http://localhost:11434/api/version > /dev/null 2>&1
do
    echo "Waiting for Ollama service..."
    sleep 5
done

# Pull the OpenAI OSS model
echo "Pulling OpenAI OSS model (this may take several minutes)..."
docker-compose exec llm ollama pull openai-oss:latest

# Verify services are running
echo "Verifying services..."
docker-compose ps

# Print access information
echo ""
echo "====================================================="
echo "Deployment complete!"
echo "====================================================="
echo "Services:"
echo "- Frontend: http://$(hostname -I | awk '{print $1}'):5173"
echo "- Backend API: http://$(hostname -I | awk '{print $1}'):8000"
echo "- LLM API: http://$(hostname -I | awk '{print $1}'):11434"
echo ""
echo "To view logs:"
echo "docker-compose logs -f"
echo ""
echo "To stop services:"
echo "docker-compose down"
echo "====================================================="