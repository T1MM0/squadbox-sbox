#!/bin/bash

# Script to set up a new Vercel project for Squabdox

# Ensure Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    echo "Vercel CLI not found. Installing Vercel CLI..."
    npm install -g vercel
fi

# Check if the user is logged in to Vercel
vercel whoami &> /dev/null
if [ $? -ne 0 ]; then
    echo "You are not logged in to Vercel. Please log in:"
    vercel login
fi

# Get project name
read -p "Enter project name (default: squadbox): " PROJECT_NAME
PROJECT_NAME=${PROJECT_NAME:-squadbox}

# Initialize the Vercel project
echo "Initializing Vercel project: $PROJECT_NAME"
vercel init

# Link to existing project or create new one
echo "Linking to Vercel project..."
vercel link

# Set up environment variables
echo "Setting up environment variables..."

# Ask for API URL
read -p "Enter API URL (default: https://api.squadbox.uk): " API_URL
API_URL=${API_URL:-https://api.squadbox.uk}

# Add environment variables
echo "Adding environment variables..."
vercel env add VITE_API_URL production $API_URL
vercel env add VITE_APP_ENV production "production"

# Preview environment
echo "Setting up preview environment variables..."
read -p "Enter Preview API URL (default: https://api-dev.squadbox.uk): " PREVIEW_API_URL
PREVIEW_API_URL=${PREVIEW_API_URL:-https://api-dev.squadbox.uk}
vercel env add VITE_API_URL preview $PREVIEW_API_URL
vercel env add VITE_APP_ENV preview "preview"

# Development environment
echo "Setting up development environment variables..."
vercel env add VITE_API_URL development "http://localhost:8000"
vercel env add VITE_APP_ENV development "development"

# Create GitHub integration if requested
read -p "Do you want to set up GitHub integration? (y/N): " SETUP_GITHUB
if [[ $SETUP_GITHUB == "y" || $SETUP_GITHUB == "Y" ]]; then
    echo "Setting up GitHub integration..."
    vercel git connect
fi

# Store project details
VERCEL_PROJECT_INFO=$(vercel project ls --json | grep -i $PROJECT_NAME -A 5 -B 5)
VERCEL_ORG_ID=$(echo $VERCEL_PROJECT_INFO | grep -oP 'orgId":\s*"\K[^"]+')
VERCEL_PROJECT_ID=$(echo $VERCEL_PROJECT_INFO | grep -oP 'id":\s*"\K[^"]+')

# Save project details to .vercel-project file
echo "Saving project details..."
cat > .vercel-project << EOF
# Vercel Project Details
VERCEL_ORG_ID=$VERCEL_ORG_ID
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID
PROJECT_NAME=$PROJECT_NAME
EOF

echo ""
echo "==========================================================="
echo "Vercel project setup complete!"
echo "Project name: $PROJECT_NAME"
echo "Organization ID: $VERCEL_ORG_ID"
echo "Project ID: $VERCEL_PROJECT_ID"
echo ""
echo "To deploy your project:"
echo "  ./deploy-vercel.sh"
echo "==========================================================="