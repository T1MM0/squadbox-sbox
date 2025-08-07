#!/usr/bin/env node

/*
 * build-vite.js
 * Purpose: Explicit Vite build script for Vercel deployment
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

console.log('🚀 Starting explicit Vite build for Squadbox');
console.log('📦 Project Type: Vite React (not Next.js)');
console.log('🔧 Build Command: vite build');

try {
  // Ensure we're in the correct directory
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const projectRoot = path.resolve(__dirname);
  console.log(`📁 Project Root: ${projectRoot}`);
  
  // Check if vite.config.js exists
  if (!fs.existsSync(path.join(projectRoot, 'vite.config.js'))) {
    throw new Error('vite.config.js not found - this is not a Vite project');
  }
  
  // Ensure this is NOT a Next.js project
  if (fs.existsSync(path.join(projectRoot, 'next.config.js')) || 
      fs.existsSync(path.join(projectRoot, 'next.config.ts'))) {
    throw new Error('Next.js config found - this should be a Vite project, not Next.js');
  }
  
  // Run the build command
  console.log('🔨 Executing: npm run build');
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: projectRoot 
  });
  
  console.log('✅ Vite build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
