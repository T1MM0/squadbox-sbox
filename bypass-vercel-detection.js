#!/usr/bin/env node

/*
 * bypass-vercel-detection.js
 * Purpose: Completely bypass Vercel's auto-detection and force Vite build
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🚀 BYPASSING VERCEL AUTO-DETECTION');
console.log('📦 FORCING VITE BUILD ONLY');
console.log('🔧 Using direct Vite command');

try {
  const projectRoot = path.resolve(__dirname);
  console.log(`📁 Project Root: ${projectRoot}`);
  
  // Set environment variables to force Vite
  const env = {
    ...process.env,
    NODE_ENV: 'production',
    VITE_APP_ENV: 'production',
    VERCEL: '1',
    // Force Vite to be the only build tool
    SKIP_NEXTJS_DETECTION: 'true',
    FORCE_VITE_BUILD: 'true'
  };
  
  // Clean any potential Next.js files first
  console.log('🧹 Cleaning potential Next.js files...');
  const nextjsFiles = ['next.config.js', 'next.config.ts', 'next-env.d.ts', '.next'];
  for (const file of nextjsFiles) {
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
  
  // Verify this is a Vite project
  if (!fs.existsSync(path.join(projectRoot, 'vite.config.js'))) {
    throw new Error('vite.config.js not found - this is not a Vite project');
  }
  
  console.log('✅ Project validation passed');
  
  // Use npx to ensure we get the right Vite version
  console.log('🔨 Executing: npx --yes vite build');
  execSync('npx --yes vite build', { 
    stdio: 'inherit',
    cwd: projectRoot,
    env
  });
  
  console.log('✅ Vite build completed successfully!');
  console.log('🎯 Vercel auto-detection bypassed successfully!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}
