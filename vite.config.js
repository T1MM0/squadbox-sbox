import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables based on mode
  const env = loadEnv(mode, process.cwd(), '');
  const isVercel = process.env.VERCEL === '1';

  // Configure build options based on mode
  const buildConfig = {
    production: {
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['@mantine/core', '@mantine/hooks'],
            icons: ['@tabler/icons-react']
          },
        },
      },
    },
    staging: {
      sourcemap: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
    development: {
      sourcemap: 'inline',
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: undefined,
        },
      },
    },
    preview: {
      sourcemap: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
    feature: {
      sourcemap: true,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
    hotfix: {
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
          },
        },
      },
    },
    release: {
      sourcemap: false,
      minify: 'esbuild',
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom'],
            vendor: ['@mantine/core', '@mantine/hooks'],
            icons: ['@tabler/icons-react']
          },
        },
      },
    },
  };

  const currentConfig = buildConfig[mode] || buildConfig.production;

  return {
    plugins: [react()],
    server: {
      port: 5173,
      open: true,
    },
    // Base path for assets - used for Vercel deployments
    base: '/',
    // Configure build options
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      // Generate manifest for better caching
      manifest: true,
      // Use mode-specific configuration
      ...currentConfig,
    },
    // Resolve paths
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
  };
});
