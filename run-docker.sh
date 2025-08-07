#!/bin/bash

# Run the Squadbox system using Docker with containerized LLM (cloud-ready)

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

echo "Starting Squadbox with containerized LLM..."
echo "This will take some time on first run as it needs to download the LLM model."

# Start the entire stack
echo "Starting Docker services..."
# Try without specifying GPU options to work on any system
docker-compose up -d

# Wait for Ollama container to be ready
echo "Waiting for Ollama to start..."
until docker-compose exec -T llm curl -s --retry 5 --retry-delay 2 http://localhost:11434/api/version > /dev/null 2>&1
do
    echo "Waiting for Ollama service..."
    sleep 2
done

# Pull the model inside the container
echo "Pulling the OpenAI OSS model (this may take several minutes on first run)..."
docker-compose exec llm ollama pull openai-oss:latest

# Show logs
echo "All services started! Showing logs..."
docker-compose logs -f

# Trap to handle Ctrl+C and clean up
trap 'echo "Stopping containers..."; docker-compose down' INT TERM EXIT