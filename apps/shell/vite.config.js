import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import federation from '@originjs/vite-plugin-federation';
import { resolve } from 'path';

// Remotes are served via `vite preview` on their respective ports after being built.
// Run `npm run build:remotes` before starting the shell dev server.
export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'shell',
      remotes: {
        mfeBudgetInput: 'http://localhost:3001/assets/remoteEntry.js',
        mfeExpenseTracker: 'http://localhost:3002/assets/remoteEntry.js',
        mfeSummary: 'http://localhost:3003/assets/remoteEntry.js',
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
    port: 3000,
    strictPort: true,
  },
  preview: {
    port: 3000,
    strictPort: true,
    cors: true,
  },
});
