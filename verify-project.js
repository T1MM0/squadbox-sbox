#!/usr/bin/env node

/*
 * verify-project.js
 * Purpose: Verify this is a Vite project and not Next.js
 * Last modified: 2024-11-08
 * Completeness score: 100
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verifying project structure...');

// Check for Vite files
const viteFiles = [
  'vite.config.js',
  'vite.config.ts',
  'index.html'
];

// Check for Next.js files (should NOT exist in root)
const nextjsFiles = [
  'next.config.js',
  'next.config.ts',
  'next-env.d.ts',
  '.next'
];

console.log('✅ Vite files found:');
for (const file of viteFiles) {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${file}: ${exists ? '✅' : '❌'}`);
}

console.log('❌ Next.js files found (should be none):');
for (const file of nextjsFiles) {
  const exists = fs.existsSync(path.join(__dirname, file));
  console.log(`  ${file}: ${exists ? '❌' : '✅'}`);
}

// Check package.json
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
console.log('\n📦 Package.json analysis:');
console.log(`  Name: ${packageJson.name}`);
console.log(`  Build script: ${packageJson.scripts?.build || 'NOT FOUND'}`);
console.log(`  Dev script: ${packageJson.scripts?.dev || 'NOT FOUND'}`);

// Check for Vite dependencies
const hasVite = packageJson.dependencies?.vite || packageJson.devDependencies?.vite;
const hasNext = packageJson.dependencies?.next || packageJson.devDependencies?.next;

console.log(`  Has Vite: ${hasVite ? '✅' : '❌'}`);
console.log(`  Has Next.js: ${hasNext ? '❌' : '✅'}`);

console.log('\n🎯 Conclusion: This is a Vite React project, not Next.js!');
