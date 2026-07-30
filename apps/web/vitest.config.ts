import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test file patterns - look for test files in components directory
    include: ['components/**/*.test.{ts,tsx}', 'lib/**/*.test.{ts,tsx}', 'tests/**/*.test.{ts,tsx}'],
    
    // Enable global test APIs (describe, it, expect, etc.) without imports
    globals: true,
    
    // Test environment for React components
    environment: 'jsdom',
    
    // Setup files
    setupFiles: ['./vitest.setup.ts'],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        '.next/',
        'coverage/',
        '**/*.config.ts',
        '**/*.config.js',
        '**/*.test.{ts,tsx}',
      ],
    },
    
    // Timeout for tests (in ms)
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
});
