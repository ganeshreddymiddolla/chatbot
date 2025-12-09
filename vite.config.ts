
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // This is needed to allow the environment variable for the API key
    // to be accessible in the development environment.
    // In a real production deployment, you would set this on your hosting platform.
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  define: {
    'process.env': process.env
  }
});
