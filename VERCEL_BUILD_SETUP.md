# Vercel Per-Branch Build Setup

This project is configured with per-environment and per-branch build commands based on [Vercel's guide](https://vercel.com/guides/per-environment-and-per-branch-build-commands).

## 🏗️ Build Configuration

### Build Scripts

The project includes different build scripts for various environments:

- `build:production` - Optimized production build
- `build:staging` - Staging build with debug info
- `build:development` - Development build with source maps
- `build:preview` - Preview build for testing
- `build:feature` - Feature branch build
- `build:hotfix` - Hotfix build with emergency fixes
- `build:release` - Release candidate build

### Branch Strategy

| Branch Pattern | Environment | Build Command | Purpose |
|----------------|-------------|---------------|---------|
| `main`/`master` | Production | `build:production` | Live production deployment |
| `develop`/`development` | Preview | `build:development` | Development testing |
| `feature/*` | Preview | `build:feature` | Feature development |
| `hotfix/*` | Preview | `build:hotfix` | Emergency fixes |
| `release/*` | Preview | `build:release` | Release candidates |
| Other branches | Preview | `build:preview` | General testing |

### Environment Variables

Each build mode can have different environment configurations:

- **Production**: Optimized for performance, no source maps
- **Staging**: Debug info enabled, source maps for debugging
- **Development**: Full source maps, no minification
- **Preview**: Balanced optimization for testing
- **Feature**: Similar to preview, optimized for feature testing
- **Hotfix**: Production-like optimization for emergency fixes
- **Release**: Production optimization for release candidates

## 🚀 Deployment

### Automatic Branch Deployments

1. **Main/Master Branch**: Deploys to production environment
2. **Feature Branches**: Deploy to preview environment with feature-specific optimizations
3. **Development Branch**: Deploys to preview with development tools enabled
4. **Hotfix Branches**: Deploy with emergency optimization settings
5. **Release Branches**: Deploy with release candidate settings

### Manual Deployment

```bash
# Deploy to production
npm run deploy

# Deploy specific branch
vercel --prod
```

## 🔧 Configuration Files

### vercel.sh
The main build script that determines which build command to run based on:
- `VERCEL_ENV` - Environment (production, preview, development)
- `VERCEL_GIT_COMMIT_REF` - Branch name

### vercel.json
Configured to use `sh vercel.sh` as the build command.

### vite.config.js
Mode-specific build configurations for different environments.

## 📊 Build Optimization

### Production Build
- No source maps
- Terser minification
- Optimized chunk splitting
- Maximum compression

### Development Build
- Inline source maps
- No minification
- Single bundle for faster development

### Preview/Feature Builds
- Source maps for debugging
- Esbuild minification
- Balanced optimization

## 🛠️ Local Development

```bash
# Start development server
npm run dev

# Build for local testing
npm run build

# Preview production build
npm run preview
```

## 🔍 Monitoring

Build logs will show:
- Environment and branch information
- Selected build command
- Build success/failure status
- Optimization details

## 📝 Notes

- All builds use the same output directory (`dist`)
- Environment variables are loaded based on build mode
- Source maps are disabled in production for security
- Chunk splitting is optimized for each environment
- Build times are optimized for Vercel's infrastructure
