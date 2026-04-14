import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfeExpenseTracker',
      filename: 'remoteEntry.js',
      exposes: {
        './ExpenseTracker': './src/components/ExpenseTracker.jsx',
      },
      shared: {
        react: { singleton: true, requiredVersion: '^18.0.0' },
        'react-dom': { singleton: true, requiredVersion: '^18.0.0' },
      },
    }),
  ],
  resolve: {
    alias: {
      '@budget/utils': resolve(__dirname, '../../packages/utils/src/index.js'),
      '@budget/ui': resolve(__dirname, '../../packages/ui/src/index.js'),
    },
  },
  build: {
    target: 'esnext',
    minify: false,
  },
  server: {
    port: 3002,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3002,
    strictPort: true,
    cors: true,
  },
});
