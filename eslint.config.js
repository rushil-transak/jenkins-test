import js from '@eslint/js'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import globals from 'globals'

export default [
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.es2020,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: {
      react: { version: 'detect' },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,

      // React 17+ automatic JSX transform — no need to import React
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',

      // Prop-types would be noise without TypeScript
      'react/prop-types': 'off',

      // Warn on unused vars but allow underscore-prefixed args
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      'no-console': 'warn',
    },
  },
  {
    // Shared utility/UI packages — same rules, no extras needed
    files: ['packages/**/*.{js,jsx}'],
    rules: {
      // Packages still explicitly import React for clarity — treat as used
      'react/jsx-uses-react': 'error',
    },
  },
  {
    // Test files — add Vitest globals so describe/it/expect/vi are not flagged
    files: ['**/*.test.{js,jsx}', '**/test-setup.js'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest, // Vitest is Jest-compatible; reuse Jest global names
        vi: 'readonly', // Vitest-specific (not in globals.jest)
      },
    },
  },
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      '**/.turbo/**',
      '**/test-results/**',
      '**/coverage/**',
    ],
  },
]
