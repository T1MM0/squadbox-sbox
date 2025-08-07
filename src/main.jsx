import React from 'react';
import ReactDOM from 'react-dom/client';
import { MantineProvider, createTheme } from '@mantine/core';
import { Notifications } from '@mantine/notifications';
import App from './App';
import { AuthProvider } from './AuthContext';
import './index.css';
import '@mantine/core/styles.css';
import '@mantine/notifications/styles.css';

// Create custom Mantine theme with color palette from https://mantine.dev/colors-generator/?color=5474B4
const theme = createTheme({
  colors: {
    brand: [
      '#ecf4ff',
      '#dce4f5',
      '#b9c7e2',
      '#94a8d0',
      '#748dc0',
      '#5f7cb7',
      '#5474b4',
      '#44639f',
      '#3a5890',
      '#2c4b80'
    ],
  },
  primaryColor: 'brand',
  primaryShade: 6, // Using shade 6 which is #5474b4 (the primary color from URL)
  fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  headings: {
    fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
  },
  defaultRadius: 'md',
  components: {
    AppShell: {
      defaultProps: {
        bg: 'var(--mantine-color-body)',
      },
    },
  },
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MantineProvider theme={theme} defaultColorScheme="dark" withCssVariables>
      <Notifications position="top-right" />
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>
);
