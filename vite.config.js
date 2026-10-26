import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(process.cwd(), '01-Frontend/src'),
      '@products': resolve(process.cwd(), '02-Products'),
      '@cart': resolve(process.cwd(), '03-Cart-Checkout'),
      '@auth': resolve(process.cwd(), '04-Authentication'),
      '@admin': resolve(process.cwd(), '05-Admin-Panel'),
      '@api': resolve(process.cwd(), '06-Database-API'),
      '@payment': resolve(process.cwd(), '07-Payment'),
    }
  },
  server: { host: '0.0.0.0' }
});