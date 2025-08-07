#!/bin/bash

# Run the Squadbox system using Docker with CPU-optimized setup

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "Error: Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Set the model to use - smaller model better suited for CPU
export LLM_MODEL="tinyllama"

echo "Starting Squadbox with CPU-optimized LLM..."
echo "This will use the smaller tinyllama model which runs better on CPUs."
echo "This will take some time on first run as it needs to download the model."

# Start the entire stack
echo "Starting Docker services..."
docker-compose up -d

# Wait for Ollama container to be ready
echo "Waiting for Ollama to start..."
until docker-compose exec -T llm curl -s --retry 5 --retry-delay 2 http://localhost:11434/api/version > /dev/null 2>&1
do
    echo "Waiting for Ollama service..."
    sleep 2
done

# Pull the model inside the container
echo "Pulling the TinyLlama model (this will take a few minutes on first run)..."
docker-compose exec llm ollama pull tinyllama

# Update backend environment to use the correct model
docker-compose exec -e LLM_MODEL=$LLM_MODEL backend bash -c 'echo "Using model: $LLM_MODEL"'

# Show logs
echo "All services started! Showing logs..."
docker-compose logs -f

# Trap to handle Ctrl+C and clean up
trap 'echo "Stopping containers..."; docker-compose down' INT TERM EXIT