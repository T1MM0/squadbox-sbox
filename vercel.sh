#!/bin/bash

# Per-environment and per-branch build commands for Squadbox
# Based on Vercel's guide: https://vercel.com/guides/per-environment-and-per-branch-build-commands

echo "🚀 Starting Vite React build for Squadbox"
echo "📦 Environment: $VERCEL_ENV, Branch: $VERCEL_GIT_COMMIT_REF"
echo "🔧 Project Type: Vite React (not Next.js)"

# Set default build command
BUILD_CMD="npm run build"

# Production environment
if [[ $VERCEL_ENV == "production" ]]; then
    echo "📦 Building for PRODUCTION environment"
    BUILD_CMD="npm run build:production"
    
    # Check if we're on main/master branch for production
    if [[ $VERCEL_GIT_COMMIT_REF == "main" || $VERCEL_GIT_COMMIT_REF == "master" ]]; then
        echo "🎯 Production build on main/master branch"
        BUILD_CMD="npm run build:production"
    else
        echo "⚠️  Production environment but not on main/master branch"
        BUILD_CMD="npm run build:staging"
    fi

# Preview environment
elif [[ $VERCEL_ENV == "preview" ]]; then
    echo "🔍 Building for PREVIEW environment"
    
    # Development branch
    if [[ $VERCEL_GIT_COMMIT_REF == "develop" || $VERCEL_GIT_COMMIT_REF == "development" ]]; then
        echo "🔧 Development branch build"
        BUILD_CMD="npm run build:development"
    
    # Feature branches
    elif [[ $VERCEL_GIT_COMMIT_REF == feature/* ]]; then
        echo "✨ Feature branch build"
        BUILD_CMD="npm run build:feature"
    
    # Hotfix branches
    elif [[ $VERCEL_GIT_COMMIT_REF == hotfix/* ]]; then
        echo "🚨 Hotfix branch build"
        BUILD_CMD="npm run build:hotfix"
    
    # Release branches
    elif [[ $VERCEL_GIT_COMMIT_REF == release/* ]]; then
        echo "📋 Release branch build"
        BUILD_CMD="npm run build:release"
    
    # Default preview
    else
        echo "👀 Preview build for branch: $VERCEL_GIT_COMMIT_REF"
        BUILD_CMD="npm run build:preview"
    fi

# Development environment
elif [[ $VERCEL_ENV == "development" ]]; then
    echo "🛠️  Building for DEVELOPMENT environment"
    BUILD_CMD="npm run build:development"

# Default fallback
else
    echo "❓ Unknown environment: $VERCEL_ENV, using default build"
    BUILD_CMD="npm run build"
fi

echo "🔨 Executing: $BUILD_CMD"
eval $BUILD_CMD

# Check build status
if [ $? -eq 0 ]; then
    echo "✅ Build completed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi
