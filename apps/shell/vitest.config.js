import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// Vitest config intentionally omits vite-plugin-federation.
// Remote MFE imports are aliased to local mock components so tests
// run without any live remote servers.
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@budget/utils': resolve(__dirname, '../../packages/utils/src/index.js'),
      '@budget/ui': resolve(__dirname, '../../packages/ui/src/index.js'),
      // Stub out module federation remote imports
      'mfeBudgetInput/BudgetInput': resolve(__dirname, 'src/__mocks__/BudgetInput.jsx'),
      'mfeExpenseTracker/ExpenseTracker': resolve(__dirname, 'src/__mocks__/ExpenseTracker.jsx'),
      'mfeSummary/Summary': resolve(__dirname, 'src/__mocks__/Summary.jsx'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test-setup.js'],
    reporters: ['default', 'junit'],
    outputFile: {
      junit: './test-results/junit.xml',
    },
  },
})
