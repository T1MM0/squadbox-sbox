# Vercel Clean Deployment Guide

## Overview
This guide provides step-by-step instructions for creating a clean build and deploying Squadbox to Vercel hosting.

## Prerequisites
- Node.js >= 18
- npm or yarn
- Vercel CLI installed (`npm i -g vercel`)

## Quick Deployment

### Option 1: Automated Script (Recommended)
```bash
./deploy-vercel-clean.sh
```

### Option 2: Manual Steps
```bash
# 1. Clean previous builds
npm run clean

# 2. Install dependencies
npm install --legacy-peer-deps

# 3. Build for production
npm run build:production

# 4. Deploy to Vercel
vercel --prod
```

## Build Configuration

### Vite Configuration
The project uses a multi-mode Vite configuration:
- **Production**: Optimized with minification and chunking
- **Staging**: With source maps for debugging
- **Development**: Full source maps and no minification

### Build Modes Available
```bash
npm run build:production    # Optimized production build
npm run build:staging       # Staging build with source maps
npm run build:development   # Development build
npm run build:preview       # Preview build
npm run build:feature       # Feature branch build
npm run build:hotfix        # Hotfix build
npm run build:release       # Release candidate build
```

## Vercel Configuration

### vercel.json
```json
{
  "version": 2,
  "buildCommand": "./explicit-vite-build.sh",
  "outputDirectory": "dist",
  "installCommand": "npm install --legacy-peer-deps",
  "framework": null,
  "regions": ["sfo1"],
  "cleanUrls": true
}
```

### Key Features
- **Explicit Build Command**: Forces Vite build, bypassing Next.js detection
- **Legacy Peer Dependencies**: Ensures compatibility with Mantine UI
- **Security Headers**: XSS protection, content type options, frame options
- **Asset Caching**: 1-year cache for static assets
- **SPA Routing**: All routes redirect to index.html

## Environment Variables

### Required for Production
```bash
VITE_API_URL=https://api.squadbox.uk
VITE_APP_ENV=production
NODE_ENV=production
```

### Optional
```bash
VERCEL=1
SKIP_NEXTJS_DETECTION=true
FORCE_VITE_BUILD=true
```

## Build Output Structure
```
dist/
├── index.html              # Main HTML file
├── assets/                 # Compiled assets
│   ├── index-*.js         # Main application bundle
│   ├── react-*.js         # React library bundle
│   ├── vendor-*.js        # Third-party libraries
│   ├── icons-*.js         # Icon library
│   └── index-*.css        # Styles
├── images/                 # Static images
├── favicon.png            # Favicon
├── robots.txt             # SEO robots file
└── sitemap.xml           # SEO sitemap
```

## Troubleshooting

### Common Issues

#### 1. Next.js Detection
**Problem**: Vercel detects Next.js instead of Vite
**Solution**: Use explicit build script and .vercelignore

#### 2. Build Failures
**Problem**: Build fails with dependency issues
**Solution**: Use `--legacy-peer-deps` flag

#### 3. Asset Loading
**Problem**: Assets not loading correctly
**Solution**: Check base path in vite.config.js

#### 4. Routing Issues
**Problem**: Direct URL access returns 404
**Solution**: Ensure vercel.json has proper rewrites

### Debug Commands
```bash
# Check build output
ls -la dist/

# Verify assets
find dist/assets -type f

# Test local build
npm run preview

# Check Vercel configuration
vercel --debug
```

## Performance Optimization

### Build Optimizations
- **Code Splitting**: React, vendor, and icons in separate chunks
- **Tree Shaking**: Unused code removed
- **Minification**: ESBuild for fast minification
- **Asset Optimization**: Compressed images and fonts

### Caching Strategy
- **Static Assets**: 1-year cache with immutable flag
- **HTML**: No cache for dynamic content
- **API Responses**: Configured per endpoint

### Bundle Analysis
```bash
# Install bundle analyzer
npm install --save-dev vite-bundle-analyzer

# Analyze build
npm run build:production
npx vite-bundle-analyzer dist/stats.html
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Environment variables configured
- [ ] API endpoints functional
- [ ] Build completes successfully
- [ ] Assets load correctly

### Post-Deployment
- [ ] Site loads without errors
- [ ] All routes functional
- [ ] Assets load correctly
- [ ] API integration working
- [ ] Performance metrics acceptable

## Monitoring

### Vercel Analytics
- Page views and performance
- Error tracking
- User behavior analytics

### Custom Monitoring
- API response times
- Build success rates
- User feedback collection

## Security

### Headers Configured
- X-Content-Type-Options: nosniff
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- Referrer-Policy: strict-origin-when-cross-origin

### Best Practices
- HTTPS enforced
- CSP headers (configure as needed)
- Regular dependency updates
- Security scanning

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify build output locally
3. Test with different Node.js versions
4. Review environment variable configuration

## Version History
- 2025-08-08: Created clean deployment guide
- 2025-08-08: Added comprehensive troubleshooting
- 2025-08-08: Optimized build configuration
