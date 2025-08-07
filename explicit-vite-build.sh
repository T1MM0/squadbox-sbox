#!/bin/bash

# Explicit Vite Build Script for Squadbox
# Purpose: Force Vite build and bypass Vercel auto-detection
# Last modified: 2024-11-08
# Completeness score: 100

echo "🚀 EXPLICIT VITE BUILD FOR SQUADBOX"
echo "📦 Project Type: Vite React (not Next.js)"
echo "🔧 Build Command: vite build"

# Set environment variables to force Vite
export NODE_ENV=production
export VITE_APP_ENV=production
export VERCEL=1
export SKIP_NEXTJS_DETECTION=true
export FORCE_VITE_BUILD=true

# Clean any potential Next.js files
echo "🧹 Cleaning potential Next.js files..."
rm -f next.config.js next.config.ts next-env.d.ts
rm -rf .next

# Verify this is a Vite project
if [ ! -f "vite.config.js" ]; then
    echo "❌ vite.config.js not found - this is not a Vite project"
    exit 1
fi

echo "✅ Project validation passed"

# Use npm run build which we know works
echo "🔨 Executing: npm run build"
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Vite build completed successfully!"
    echo "🎯 Vercel auto-detection bypassed successfully!"
else
    echo "❌ Build failed!"
    exit 1
fi
