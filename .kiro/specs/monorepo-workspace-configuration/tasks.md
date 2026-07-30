# Implementation Plan: Monorepo Workspace Configuration

## Overview

This implementation creates a production-grade monorepo workspace configuration for OpenWitness using pnpm v11, TurboRepo v2, TypeScript 5+, and Node 22 LTS. The implementation follows a bottom-up approach: starting with basic configuration files, then adding tooling configurations, and finally integrating everything with the root package and validation.

## Tasks

- [x] 1. Create basic workspace structure configuration files
  - [x] 1.1 Create pnpm-workspace.yaml with package location patterns
    - Define patterns for apps/*, packages/*, and docs directories
    - Ensure YAML format is valid
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 9.1_

  - [x] 1.2 Create .editorconfig for cross-editor consistency
    - Set UTF-8 encoding, LF line endings, and indentation rules
    - Configure settings for different file types (JS/TS, JSON, YAML, Markdown)
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 9.3_

  - [x] 1.3 Create .npmrc for pnpm behavior configuration
    - Enable strict peer dependency checking
    - Disable auto-install of peers and phantom dependencies
    - Configure security and publishing settings
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 6.5, 10.2_

- [x] 2. Create code formatting and style configuration
  - [x] 2.1 Create .prettierrc with formatting rules
    - Define code style settings (semicolons, quotes, line width, indentation)
    - Configure for JavaScript, TypeScript, JSON, Markdown, and YAML
    - Ensure JSON format is valid
    - _Requirements: 4.1, 4.2, 4.3, 9.4_

  - [x] 2.2 Create .prettierignore to exclude generated files
    - Add patterns for node_modules, dist, build, .next, .turbo, coverage
    - Exclude lockfiles and minified files
    - _Requirements: 4.4, 4.5_

- [x] 3. Create TypeScript base configuration
  - [x] 3.1 Create tsconfig.base.json with shared compiler options
    - Set target to ES2022 and enable strict type checking
    - Configure modern module resolution (bundler)
    - Define path aliases for workspace packages (@openwitness/*)
    - Add incremental and noEmit options for performance
    - Exclude build directories and node_modules
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 9.2_

- [x] 4. Create TurboRepo build orchestration configuration
  - [x] 4.1 Create turbo.json with pipeline definitions
    - Define build task with dependency orchestration (^build) and output caching
    - Define dev task as persistent and non-cached
    - Define lint task depending on build outputs
    - Define test task with coverage output caching
    - Define clean task as non-cached
    - Include TurboRepo JSON schema reference
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 9.2, 10.3, 10.4_

- [x] 5. Create root package.json with workspace metadata
  - [x] 5.1 Create package.json with workspace configuration
    - Mark as private to prevent publishing
    - Set type to "module" for ES modules
    - Specify packageManager as pnpm@11.15.1
    - Define engines for Node.js >=22.0.0 and pnpm >=11.0.0
    - Add workspace-wide scripts delegating to turbo (dev, build, lint, test, typecheck)
    - Add format scripts using prettier directly
    - Add clean script combining turbo and manual cleanup
    - Include devDependencies: turbo, typescript, prettier, @types/node
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 9.2, 10.1, 10.5_

- [x] 6. Checkpoint - Validate configuration files
  - Ensure all configuration files are created
  - Ensure all files are valid according to their formats (YAML, JSON, INI)
  - Ask the user if questions arise
  - _Requirements: 8.4, 9.6_

- [x] 7. Create test infrastructure
  - [x] 7.1 Set up testing framework with vitest
    - Install vitest and @vitest/ui as dev dependencies
    - Create vitest.config.ts at workspace root for configuration tests
    - Configure test globals and file patterns
    - _Requirements: 8.1, 8.2, 8.3_

  - [ ]* 7.2 Create unit tests for configuration file validation
    - Test workspace.test.ts: Validate pnpm-workspace.yaml structure and patterns
    - Test turbo.test.ts: Validate turbo.json pipeline definitions and task configuration
    - Test typescript.test.ts: Validate tsconfig.base.json compiler options and path aliases
    - Test prettier.test.ts: Validate .prettierrc rules and .prettierignore patterns
    - Test editorconfig.test.ts: Validate .editorconfig settings
    - Test npmrc.test.ts: Validate .npmrc pnpm behavior settings
    - _Requirements: 1.2, 1.3, 1.4, 2.2, 2.6, 2.7, 3.2, 3.3, 3.4, 3.5, 4.1, 4.2, 4.3, 4.5, 5.2, 5.3, 5.4, 5.5, 5.6, 6.2, 6.3, 6.5, 9.1, 9.2, 9.3, 9.4, 10.1, 10.2_

  - [ ]* 7.3 Create integration tests for tool execution
    - Test install.test.ts: Verify pnpm install completes without errors
    - Test format.test.ts: Verify prettier --check runs successfully
    - Test typecheck.test.ts: Verify tsc --noEmit validates configuration
    - Test metadata.test.ts: Verify root package.json structure and script delegation
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6, 8.1, 8.3, 8.4_

  - [ ]* 7.4 Install fast-check for property-based testing
    - Add fast-check as a dev dependency
    - Configure for TypeScript usage in vitest
    - _Requirements: Property testing infrastructure_

  - [ ]* 7.5 Write property test for tooling dependencies
    - **Property 1: Tooling Dependencies Only**
    - **Validates: Requirements 10.5**
    - Create property test that verifies root package.json only contains development tooling (not application libraries)
    - Use fast-check to generate various dependency configurations
    - Test with patterns matching known tooling vs application libraries
    - Run with minimum 100 iterations

- [x] 8. Create documentation and usage guides
  - [x] 8.1 Create README.md in .kiro/specs/monorepo-workspace-configuration/
    - Document the workspace structure and configuration files
    - Explain how to use workspace scripts (dev, build, lint, test, format)
    - Provide troubleshooting guide for common issues
    - Include examples of extending configurations in packages
    - _Requirements: Configuration documentation for developers_

- [x] 9. Final checkpoint - Comprehensive validation
  - Run all tests to ensure configuration is correct
  - Verify all workspace scripts execute successfully
  - Verify pnpm install resolves dependencies correctly
  - Ensure configuration follows monorepo best practices
  - Ask the user if questions arise before completing
  - _Requirements: 8.1, 8.2, 8.3, 8.4, 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation at key milestones
- Configuration files follow industry standards and modern best practices
- All configurations use official schemas where available for validation
- Testing includes both unit tests (specific values) and property tests (universal properties)
- Implementation creates configuration files that workspace packages can extend
