#!/usr/bin/env node

/*
 * clean-nextjs-files.js
 * Purpose: Clean up any Next.js files that might confuse Vercel
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧹 Cleaning up any Next.js files that might confuse Vercel...');

const nextjsFiles = [
  'next.config.js',
  'next.config.ts',
  'next-env.d.ts',
  '.next'
];

let cleaned = false;

for (const file of nextjsFiles) {
  const filePath = path.join(__dirname, file);
  if (fs.existsSync(filePath)) {
    if (fs.statSync(filePath).isDirectory()) {
      fs.rmSync(filePath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(filePath);
    }
    console.log(`🗑️  Removed: ${file}`);
    cleaned = true;
  }
}

if (!cleaned) {
  console.log('✅ No Next.js files found in root directory');
} else {
  console.log('✅ Cleanup completed');
}

console.log('🎯 Root directory is now clean for Vite build');
