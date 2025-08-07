# My Project

A high-converting marketing landing page built with Next.js and TailwindCSS.

## Features

- Responsive design for all devices
- Modern and clean UI with animations
- Lead capture form with validation
- Integration with SendGrid for email collection
- A/B testing ready
- SEO optimized

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file with the following:

```
SENDGRID_API_KEY=your_sendgrid_api_key
CONTACT_EMAIL=your_email@example.com
```

## Deployment

This landing page can be easily deployed to Vercel, Netlify, or any static hosting service.

```bash
# Deploy to Vercel
vercel
```

## Customizing

- Update content in `src/data/content.js`
- Replace images in `public/images/`
- Adjust colors in `tailwind.config.js`
