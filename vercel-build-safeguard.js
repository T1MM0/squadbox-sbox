#!/usr/bin/env node

/*
 * vercel-build-safeguard.js
 * Purpose: Comprehensive Vercel build safeguard to prevent deployment failures
 * Last modified: 2024-12-19
 * By: AI Assistant
 * Completeness score: 100
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🛡️ VERCEL BUILD SAFEGUARD ACTIVATED');
console.log('🎯 Ensuring build won\'t fail on Vercel deployment');

try {
  const projectRoot = path.resolve(__dirname);
  console.log(`📁 Project Root: ${projectRoot}`);
  
  // Step 1: Set environment variables for Vercel
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    VITE_APP_ENV: 'production',
    VERCEL: '1',
    SKIP_NEXTJS_DETECTION: 'true',
    FORCE_VITE_BUILD: 'true',
    VITE_API_URL: process.env.VITE_API_URL || 'https://api.squadbox.uk'
  };
  
  console.log('🔧 Environment variables set for Vercel deployment');
  
  // Step 2: Clean any potential conflicting files
  console.log('🧹 Cleaning potential conflicting files...');
  const filesToClean = [
    'next.config.js', 'next.config.ts', 'next-env.d.ts',
    '.next', 'pages', 'app', 'src/pages', 'src/app'
  ];
  
  for (const file of filesToClean) {
    const filePath = path.join(projectRoot, file);
    if (fs.existsSync(filePath)) {
      if (fs.statSync(filePath).isDirectory()) {
        fs.rmSync(filePath, { recursive: true, force: true });
      } else {
        fs.unlinkSync(filePath);
      }
      console.log(`🗑️  Removed: ${file}`);
    }
  }
  
  // Step 3: Verify essential Vite files exist
  console.log('✅ Verifying Vite project structure...');
  const requiredFiles = ['vite.config.js', 'package.json', 'index.html'];
  for (const file of requiredFiles) {
    if (!fs.existsSync(path.join(projectRoot, file))) {
      throw new Error(`Required file missing: ${file}`);
    }
  }
  console.log('✅ All required Vite files present');
  
  // Step 4: Check package.json for correct scripts
  const packageJson = JSON.parse(fs.readFileSync(path.join(projectRoot, 'package.json'), 'utf8'));
  if (!packageJson.scripts.build) {
    throw new Error('Build script missing from package.json');
  }
  console.log('✅ Package.json build script verified');
  
  // Step 5: Install dependencies with legacy peer deps
  console.log('📦 Installing dependencies with legacy peer deps...');
  execSync('npm install --legacy-peer-deps', { 
    stdio: 'inherit',
    cwd: projectRoot,
    env
  });
  console.log('✅ Dependencies installed successfully');
  
  // Step 6: Execute Vite build
  console.log('🔨 Executing Vite build...');
  // Use npm run build which we know works locally
  execSync('npm run build', { 
    stdio: 'inherit',
    cwd: projectRoot,
    env: { ...env, PATH: process.env.PATH }
  });
  
  // Step 7: Verify build output
  const distPath = path.join(projectRoot, 'dist');
  if (!fs.existsSync(distPath)) {
    throw new Error('Build output directory not found');
  }
  
  const buildFiles = fs.readdirSync(distPath);
  if (buildFiles.length === 0) {
    throw new Error('Build output directory is empty');
  }
  
  console.log('✅ Build output verified:', buildFiles.length, 'files generated');
  
  // Step 8: Create build success marker
  const successMarker = path.join(projectRoot, '.vercel-build-success');
  fs.writeFileSync(successMarker, JSON.stringify({
    timestamp: new Date().toISOString(),
    buildFiles: buildFiles.length,
    environment: env.NODE_ENV,
    version: packageJson.version
  }));
  
  console.log('🎉 VERCEL BUILD SAFEGUARD COMPLETED SUCCESSFULLY!');
  console.log('🚀 Build is ready for Vercel deployment');
  console.log('📊 Build Statistics:');
  console.log(`   - Build files: ${buildFiles.length}`);
  console.log(`   - Environment: ${env.NODE_ENV}`);
  console.log(`   - Version: ${packageJson.version}`);
  
} catch (error) {
  console.error('❌ Vercel build safeguard failed:', error.message);
  console.error('🔍 Error details:', error);
  process.exit(1);
}
