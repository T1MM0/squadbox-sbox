#!/bin/bash

# Script to deploy Squabdox to Vercel

# Ensure we have the necessary dependencies
npm install

# Check if Vercel CLI is installed
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

# Ask which environment to deploy to
echo ""
echo "Select deployment environment:"
echo "1) Production"
echo "2) Preview (default branch)"
echo "3) Development (with environment variables)"
read -p "Enter your choice (default: 1): " DEPLOY_ENV

case $DEPLOY_ENV in
    1|"")
        echo "Deploying to production..."
        DEPLOY_CMD="vercel --prod"
        ;;
    2)
        echo "Deploying as preview..."
        DEPLOY_CMD="vercel"
        ;;
    3)
        echo "Deploying with development settings..."
        # Create environment file if it doesn't exist
        if [ ! -f ".env.local" ]; then
            echo "Creating .env.local file..."
            cat > .env.local << EOF
VITE_API_URL=https://api-dev.squadbox.uk
VITE_APP_ENV=development
EOF
        fi
        DEPLOY_CMD="vercel --env-file .env.local"
        ;;
    *)
        echo "Invalid option. Exiting."
        exit 1
        ;;
esac

# Run the deployment command
echo "Starting deployment..."
eval $DEPLOY_CMD

# Check if deployment was successful
if [ $? -eq 0 ]; then
    echo "Deployment completed successfully!"
    
    # If deploying to production, tag the release
    if [ "$DEPLOY_ENV" == "1" ] || [ -z "$DEPLOY_ENV" ]; then
        CURRENT_DATE=$(date +"%Y%m%d-%H%M%S")
        echo "Tagging release as v$CURRENT_DATE"
        git tag "v$CURRENT_DATE"
        git push origin "v$CURRENT_DATE" || echo "Couldn't push tag to remote. Tag created locally only."
    fi
else
    echo "Deployment failed. Check the logs above for details."
    exit 1
fi