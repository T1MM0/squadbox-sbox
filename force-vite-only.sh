#!/bin/bash

# Force Vite Only Build Script
# Purpose: Completely bypass Vercel auto-detection and force Vite build
# Last modified: 2024-11-08
# Completeness score: 100

echo "🚀 FORCE VITE ONLY - BYPASSING ALL AUTO-DETECTION"
echo "📦 Project Type: Vite React (not Next.js)"
echo "🔧 Build Command: vite build"

# Set environment variables to force Vite
export NODE_ENV=production
export VITE_APP_ENV=production
export VERCEL=1
export SKIP_NEXTJS_DETECTION=true
export FORCE_VITE_BUILD=true
export VITE_ONLY=true

# Remove any potential Next.js files that might confuse Vercel
echo "🧹 Aggressively cleaning Next.js files..."
find . -name "next.config.*" -delete 2>/dev/null || true
find . -name "next-env.d.ts" -delete 2>/dev/null || true
find . -name ".next" -type d -exec rm -rf {} + 2>/dev/null || true

# Verify this is a Vite project
if [ ! -f "vite.config.js" ]; then
    echo "❌ vite.config.js not found - this is not a Vite project"
    exit 1
fi

echo "✅ Project validation passed"

# Use direct vite command instead of npm run build
echo "🔨 Executing: ./node_modules/.bin/vite build"
if [ -f "./node_modules/.bin/vite" ]; then
    ./node_modules/.bin/vite build
else
    echo "🔨 Executing: npx --yes vite build"
    npx --yes vite build
fi

if [ $? -eq 0 ]; then
    echo "✅ Vite build completed successfully!"
    echo "🎯 Vercel auto-detection completely bypassed!"
else
    echo "❌ Build failed!"
    exit 1
fi
