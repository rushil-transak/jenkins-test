import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'mfeSummary',
      filename: 'remoteEntry.js',
      exposes: {
        './Summary': './src/components/Summary.jsx',
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
    port: 3003,
    strictPort: true,
    cors: true,
  },
  preview: {
    port: 3003,
    strictPort: true,
    cors: true,
  },
});
