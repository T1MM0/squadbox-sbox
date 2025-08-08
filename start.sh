#!/bin/bash

# Squadbox Startup Script
# Purpose: Start all required servers for development
# Last modified: 2025-08-08
# Completeness score: 100

echo "🚀 Starting Squadbox Development Environment"
echo "============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Function to check if a port is in use
check_port() {
    local port=$1
    if lsof -Pi :$port -sTCP:LISTEN -t >/dev/null ; then
        echo "⚠️  Port $port is already in use"
        return 1
    else
        echo "✅ Port $port is available"
        return 0
    fi
}

# Function to kill process on port
kill_port() {
    local port=$1
    local pid=$(lsof -ti:$port)
    if [ ! -z "$pid" ]; then
        echo "🔄 Killing process on port $port (PID: $pid)"
        kill -9 $pid 2>/dev/null
        sleep 2
    fi
}

# Function to kill processes by name
kill_processes_by_name() {
    local process_name=$1
    local pids=$(pgrep -f "$process_name")
    if [ ! -z "$pids" ]; then
        echo "🔄 Killing $process_name processes (PIDs: $pids)"
        echo $pids | xargs kill -9 2>/dev/null
        sleep 2
    fi
}

# Comprehensive cleanup of prior instances
echo "🧹 Clearing prior instances..."
echo "🔍 Checking for existing processes..."

# Kill processes by name (more thorough)
kill_processes_by_name "python.*app.py"
kill_processes_by_name "python.*direct_start.py"
kill_processes_by_name "uvicorn"
kill_processes_by_name "vite"
kill_processes_by_name "node.*vite"

# Kill processes on specific ports
echo "🔍 Checking and clearing ports..."
kill_port 8000
kill_port 5173
kill_port 5174
kill_port 3700  # Legacy port, just in case

# Additional cleanup for Node.js processes
echo "🧹 Clearing Node.js processes..."
pkill -f "node.*dev" 2>/dev/null
pkill -f "npm.*dev" 2>/dev/null

# Wait for processes to fully terminate
echo "⏳ Waiting for processes to terminate..."
sleep 3

# Verify ports are clear
echo "✅ Verifying ports are clear..."
check_port 8000
check_port 5173
check_port 5174

echo "🧹 Cleanup complete!"
echo ""

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
fi

# Check if backend dependencies are installed
if [ ! -d "backend/venv" ]; then
    echo "Installing backend dependencies..."
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt 2>/dev/null || pip install fastapi uvicorn python-dotenv supabase
    cd ..
fi

# Start backend server
echo "🔧 Starting backend server..."
cd backend
source venv/bin/activate

# Start backend using direct_start.py (which runs on port 8000)
echo "Starting FastAPI backend on port 8000..."
python3 direct_start.py &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Check if backend started successfully
if curl -s http://localhost:8000/docs >/dev/null 2>&1; then
    echo "✅ Backend server started successfully on port 8000"
else
    echo "❌ Backend server failed to start"
    echo "Trying alternative backend startup..."
    cd backend
    source venv/bin/activate
    python3 app.py &
    BACKEND_PID=$!
    cd ..
    sleep 3
fi

# Start frontend development server
echo "🎨 Starting frontend development server..."
echo "Starting Vite development server..."
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 5

# Check if frontend started successfully
if curl -s http://localhost:5173 >/dev/null 2>&1 || curl -s http://localhost:5174 >/dev/null 2>&1; then
    echo "✅ Frontend server started successfully"
else
    echo "❌ Frontend server failed to start"
fi

# Display server information
echo ""
echo "🎉 Squadbox Development Environment Started!"
echo "============================================="
echo ""
echo "📋 Server Information:"
echo "   Backend API:  http://localhost:8000"
echo "   Frontend App: http://localhost:5173 (or 5174)"
echo "   API Docs:     http://localhost:8000/docs"
echo ""
echo "🔧 Available Endpoints:"
echo "   - Templates:     http://localhost:8000/templates/"
echo "   - Generate:      http://localhost:8000/generate-project/"
echo "   - Build Status:  http://localhost:8000/build-status/{id}"
echo "   - Logs:          http://localhost:8000/logs/{id}"
echo ""
echo "👤 Test Login:"
echo "   Email:    admin@squadbox.co.uk"
echo "   Password: wibmog-buxmuj-0xukzU"
echo ""
echo "🛑 To stop all servers, press Ctrl+C"
echo ""

# Function to cleanup on exit
cleanup() {
    echo ""
    echo "🛑 Stopping all servers..."
    
    # Kill backend
    if [ ! -z "$BACKEND_PID" ]; then
        echo "Stopping backend server (PID: $BACKEND_PID)"
        kill $BACKEND_PID 2>/dev/null
    fi
    
    # Kill frontend
    if [ ! -z "$FRONTEND_PID" ]; then
        echo "Stopping frontend server (PID: $FRONTEND_PID)"
        kill $FRONTEND_PID 2>/dev/null
    fi
    
    # Comprehensive cleanup
    echo "🧹 Comprehensive cleanup..."
    kill_processes_by_name "python.*app.py"
    kill_processes_by_name "python.*direct_start.py"
    kill_processes_by_name "uvicorn"
    kill_processes_by_name "vite"
    kill_processes_by_name "node.*vite"
    pkill -f "node.*dev" 2>/dev/null
    pkill -f "npm.*dev" 2>/dev/null
    
    # Kill any remaining processes on our ports
    kill_port 8000
    kill_port 5173
    kill_port 5174
    kill_port 3700
    
    echo "✅ All servers stopped"
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Keep script running
echo "⏳ Servers are running. Press Ctrl+C to stop all servers."
echo ""

# Wait for user to stop
wait
