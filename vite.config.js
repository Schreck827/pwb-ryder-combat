import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    cors: {
      origin: 'https://www.owlbear.rodeo',
    },
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['pwb-ryder-combat.onrender.com'],
  },
});
