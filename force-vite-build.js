#!/usr/bin/env node

/*
 * force-vite-build.js
 * Purpose: Force Vite build and prevent Next.js detection
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 FORCING VITE BUILD - NO NEXT.JS ALLOWED');
console.log('📦 Project Type: Vite React (not Next.js)');
console.log('🔧 Build Command: vite build');

try {
  // Ensure we're in the correct directory
  const projectRoot = path.resolve(__dirname);
  console.log(`📁 Project Root: ${projectRoot}`);
  
  // First, clean up any Next.js files that might confuse Vercel
  console.log('🧹 Cleaning up any Next.js files...');
  try {
    execSync('node clean-nextjs-files.js', { stdio: 'inherit', cwd: projectRoot });
  } catch (error) {
    console.log('⚠️  Cleanup script not found, continuing...');
  }
  
  // Check if vite.config.js exists
  if (!fs.existsSync(path.join(projectRoot, 'vite.config.js'))) {
    throw new Error('vite.config.js not found - this is not a Vite project');
  }
  
  // Ensure this is NOT a Next.js project
  if (fs.existsSync(path.join(projectRoot, 'next.config.js')) || 
      fs.existsSync(path.join(projectRoot, 'next.config.ts'))) {
    throw new Error('Next.js config found - this should be a Vite project, not Next.js');
  }
  

  
  // Check package.json to ensure it's a Vite project
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const buildScript = packageJson.scripts?.build;
  
  if (!buildScript || !buildScript.includes('vite')) {
    throw new Error('Package.json build script is not a Vite build command');
  }
  
  console.log('✅ Project validation passed - this is a Vite project');
  
  // Run the build command directly with vite
  console.log('🔨 Executing: npx vite build');
  execSync('npx vite build', { 
    stdio: 'inherit',
    cwd: projectRoot,
    env: {
      ...process.env,
      NODE_ENV: 'production',
      VITE_APP_ENV: 'production'
    }
  });
  
  console.log('✅ Vite build completed successfully!');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
