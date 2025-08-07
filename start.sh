#!/bin/bash

# Function to kill processes using specific ports
clear_ports() {
  echo "Clearing any processes using required ports..."
  
  # Check for processes using backend port 3700
  BACKEND_PIDS=$(lsof -ti:3700 2>/dev/null)
  if [[ ! -z "$BACKEND_PIDS" ]]; then
    echo "Found processes using backend port 3700. Terminating them..."
    echo $BACKEND_PIDS | xargs kill -9
    echo "Processes terminated."
  else
    echo "No processes found using backend port 3700."
  fi
  
  # Check for processes using frontend ports (Vite tries 5173, 5174, 5175)
  for PORT in 5173 5174 5175; do
    FRONTEND_PIDS=$(lsof -ti:$PORT 2>/dev/null)
    if [[ ! -z "$FRONTEND_PIDS" ]]; then
      echo "Found processes using frontend port $PORT. Terminating them..."
      echo $FRONTEND_PIDS | xargs kill -9
      echo "Processes terminated."
    else
      echo "No processes found using frontend port $PORT."
    fi
  done
  
  # Check for any uvicorn or node processes that might be stuck
  echo "Checking for any stray uvicorn or node processes..."
  ps aux | grep -E 'uvicorn.*app:app|vite' | grep -v grep | awk '{print $2}' | xargs kill -9 2>/dev/null
  
  # Wait a moment to ensure ports are released
  sleep 1
  echo "Port clearing complete."
}

# Run the port clearing function
clear_ports

# Check if .env file exists
if [ ! -f .env ]; then
  echo "Warning: .env file not found in project root."
  echo "AI code generation may not work without an OpenAI API key."
  echo "Please see OPENAI_SETUP.md for instructions."
  echo ""
fi

# Start the backend (FastAPI, assumes uvicorn is installed)
echo "Starting backend (FastAPI on :3700) ..."
cd backend
uvicorn app:app --host 0.0.0.0 --port 3700 &
BACKEND_PID=$!
cd ..

# Start the frontend (Vite)
echo "Starting frontend (Vite on :5173) ..."
cd src
npm run dev &
FRONTEND_PID=$!
cd ..

# Setup proper cleanup on script exit
cleanup() {
  echo "Shutting down services..."
  
  # Kill the processes we started
  if [[ ! -z "$BACKEND_PID" ]]; then
    kill -9 $BACKEND_PID 2>/dev/null
    echo "Backend process terminated."
  fi
  
  if [[ ! -z "$FRONTEND_PID" ]]; then
    kill -9 $FRONTEND_PID 2>/dev/null
    echo "Frontend process terminated."
  fi
  
  # Extra check for any remaining processes
  clear_ports
  
  echo "Cleanup complete."
}

# Register the cleanup function to run on exit
trap cleanup EXIT

# Wait for user to press Ctrl+C
echo ""
echo "Services are running. Press Ctrl+C to stop."
wait $BACKEND_PID $FRONTEND_PID
