import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Test file patterns - look for test files in tests/ and __tests__/ directories
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    
    // Enable global test APIs (describe, it, expect, etc.) without imports
    globals: true,
    
    // Test environment (node is default for configuration testing)
    environment: 'node',
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'build/',
        '.next/',
        '.turbo/',
        'coverage/',
        '**/*.config.ts',
        '**/*.config.js',
      ],
    },
    
    // Timeout for tests (in ms)
    testTimeout: 10000,
    
    // Enable concurrent test execution for better performance
    concurrent: true,
  },
});
