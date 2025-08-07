# Deploying Squabdox to Vercel

This guide explains how to deploy the Squabdox frontend application to Vercel.

## Prerequisites

- A [Vercel account](https://vercel.com/signup)
- Vercel CLI installed (`npm install -g vercel`)
- Node.js and npm

## Deployment Options

### Option 1: Quick Deployment (Recommended)

Use our deployment script:

```bash
./deploy-vercel.sh
```

This script will:
1. Check if Vercel CLI is installed
2. Log you in to Vercel if needed
3. Ask which environment to deploy to (production/preview/development)
4. Handle the deployment and environment variables
5. Tag the release in git if it's a production deployment

### Option 2: Manual Deployment

#### Step 1: Install Dependencies

```bash
npm install
```

#### Step 2: Login to Vercel

```bash
vercel login
```

#### Step 3: Deploy to Vercel

```bash
# For production deployment
vercel --prod

# For preview deployment
vercel
```

## Configuration

### Environment Variables

Squabdox requires the following environment variables:

- `VITE_API_URL`: URL to the backend API
  - Production: `https://api.squadbox.uk`
  - Development: `https://api-dev.squadbox.uk`

You can set these in the Vercel dashboard or using the Vercel CLI:

```bash
vercel env add VITE_API_URL
```

### Custom Domain

To set up a custom domain:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Domains
3. Add your custom domain and follow the verification steps

## Vercel Configuration

The `vercel.json` file in the project root contains the Vercel-specific configuration:

- Build and installation commands
- Output directory
- Headers for security and caching
- Routing rules for the SPA

## CI/CD Integration

### GitHub Actions

To set up automatic deployment with GitHub Actions:

1. Create a Vercel token in the Vercel dashboard
2. Add the token as a secret in your GitHub repository (`VERCEL_TOKEN`)
3. Create a workflow file (`.github/workflows/deploy.yml`) with the following content:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

## Troubleshooting

### Build Failures

If the build fails, check:

1. The build logs in the Vercel dashboard
2. That all required environment variables are set
3. That the project successfully builds locally with `npm run build`

### API Connection Issues

If the frontend can't connect to the API:

1. Check that `VITE_API_URL` is correctly set
2. Ensure CORS is properly configured on the backend
3. Verify that the API is accessible from the Vercel deployment

## Further Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)