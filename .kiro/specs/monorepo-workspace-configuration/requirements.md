# Requirements Document

## Introduction

This document defines requirements for establishing a production-grade monorepo workspace configuration for OpenWitness. The configuration will standardize tooling, build orchestration, code formatting, and dependency management across a monorepo structure containing multiple applications (apps/api, apps/web) and shared packages (packages/config, packages/types, packages/ui, packages/utils).

The workspace configuration must support modern development practices using pnpm v11, TurboRepo v2, TypeScript 5+/7, and Node 22 LTS.

## Glossary

- **Workspace_Configuration**: The set of configuration files that define monorepo structure, build orchestration, code style, and tooling behavior
- **pnpm_Workspace**: A pnpm-managed monorepo where multiple packages share a single lockfile and node_modules structure
- **TurboRepo**: A build orchestration tool that optimizes monorepo builds through caching and parallel execution
- **Root_Package**: The top-level package.json that defines workspace-wide scripts and dependencies
- **Workspace_Package**: An individual package within the monorepo (apps or packages)
- **Build_Pipeline**: The ordered sequence of tasks (lint, test, build) executed by TurboRepo
- **Code_Formatter**: A tool that automatically enforces consistent code style (Prettier)
- **Editor_Config**: Cross-editor configuration for basic code style preferences
- **Type_System**: TypeScript configuration for static type checking across the workspace

## Requirements

### Requirement 1: Workspace Structure Definition

**User Story:** As a developer, I want a defined workspace structure, so that pnpm knows which directories contain packages to manage.

#### Acceptance Criteria

1. THE Workspace_Configuration SHALL define package locations using a pnpm-workspace.yaml file
2. THE pnpm_Workspace SHALL include all directories under apps/* as workspace packages
3. THE pnpm_Workspace SHALL include all directories under packages/* as workspace packages
4. THE pnpm_Workspace SHALL include the docs/ directory as a workspace package
5. WHEN pnpm install is executed, THE pnpm_Workspace SHALL resolve dependencies across all defined workspace packages

### Requirement 2: Build Orchestration Configuration

**User Story:** As a developer, I want optimized build orchestration, so that builds are fast and cacheable across the entire monorepo.

#### Acceptance Criteria

1. THE Workspace_Configuration SHALL define a turbo.json configuration for build orchestration
2. THE TurboRepo SHALL define pipelines for build, dev, lint, test, and clean tasks
3. THE TurboRepo SHALL cache task outputs based on input dependencies
4. WHEN a task has already been executed with the same inputs, THE TurboRepo SHALL restore cached outputs
5. THE TurboRepo SHALL execute independent tasks in parallel
6. THE TurboRepo SHALL respect task dependencies (build depends on dependencies being built first)
7. THE Build_Pipeline SHALL define appropriate input/output directories for caching

### Requirement 3: TypeScript Base Configuration

**User Story:** As a developer, I want a shared TypeScript configuration, so that all workspace packages use consistent type-checking rules.

#### Acceptance Criteria

1. THE Workspace_Configuration SHALL define a tsconfig.base.json at the root
2. THE Type_System SHALL use TypeScript 5+ compatible configuration options
3. THE Type_System SHALL support path aliases for workspace packages
4. THE Type_System SHALL enable strict type checking
5. THE Type_System SHALL define appropriate compiler options for modern JavaScript (ES2022+)
6. WHEN a workspace package extends the base config, THE Type_System SHALL inherit all base settings

### Requirement 4: Code Formatting Configuration

**User Story:** As a developer, I want automatic code formatting, so that all code follows consistent style guidelines without manual effort.

#### Acceptance Criteria

1. THE Workspace_Configuration SHALL define a .prettierrc file for code formatting rules
2. THE Code_Formatter SHALL format JavaScript, TypeScript, JSON, Markdown, and YAML files
3. THE Code_Formatter SHALL use consistent indentation, line width, and quote style
4. THE Workspace_Configuration SHALL define a .prettierignore file to exclude generated files
5. THE Code_Formatter SHALL ignore node_modules, dist, build, and .next directories
6. WHEN the format script is executed, THE Code_Formatter SHALL format all non-ignored files

### Requirement 5: Editor Configuration

**User Story:** As a developer, I want consistent basic editor settings, so that all team members use the same indentation and line endings regardless of their editor.

#### Acceptance Criteria

1. THE Workspace_Configuration SHALL define an .editorconfig file
2. THE Editor_Config SHALL specify UTF-8 character encoding
3. THE Editor_Config SHALL specify LF line endings
4. THE Editor_Config SHALL specify indentation rules for different file types
5. THE Editor_Config SHALL enable trimming of trailing whitespace
6. THE Editor_Config SHALL ensure files end with a newline

### Requirement 6: Package Manager Configuration

**User Story:** As a developer, I want consistent package manager behavior, so that dependency installation works reliably across different environments.

#### Acceptance Criteria

1. THE Workspace_Configuration SHALL define an .npmrc file for pnpm configuration
2. THE pnpm_Workspace SHALL use strict peer dependencies checking
3. THE pnpm_Workspace SHALL disable automatic installation of peer dependencies
4. THE pnpm_Workspace SHALL use a shared store for faster installations
5. THE pnpm_Workspace SHALL prevent publishing of private workspace packages

### Requirement 7: Root Package Metadata

**User Story:** As a developer, I want a properly configured root package, so that the monorepo is clearly marked as private and has correct workspace scripts.

#### Acceptance Criteria

1. THE Root_Package SHALL be marked as private to prevent accidental publishing
2. THE Root_Package SHALL define workspace-wide scripts (dev, build, lint, test, format, clean)
3. THE Root_Package SHALL specify the correct package manager version (pnpm@11.15.1)
4. THE Root_Package SHALL specify Node.js engine requirements (>=22.0.0)
5. THE Root_Package SHALL include TurboRepo and TypeScript as dev dependencies
6. WHEN workspace scripts are executed, THE Root_Package SHALL delegate to TurboRepo for orchestration

### Requirement 8: Configuration Validation

**User Story:** As a developer, I want to verify the workspace configuration, so that I can confirm all tools are properly integrated.

#### Acceptance Criteria

1. WHEN pnpm install is executed, THE pnpm_Workspace SHALL resolve without errors
2. WHEN turbo build is executed, THE TurboRepo SHALL execute build tasks without errors
3. WHEN the format script is executed, THE Code_Formatter SHALL process files without errors
4. THE Workspace_Configuration SHALL be parseable by all specified tools (pnpm, turbo, tsc, prettier, editorconfig)
5. IF a configuration file has syntax errors, THEN THE respective tool SHALL report a descriptive error message

### Requirement 9: Configuration File Format Standards

**User Story:** As a developer, I want properly formatted configuration files, so that they are readable and follow best practices.

#### Acceptance Criteria

1. THE Workspace_Configuration SHALL use YAML format for pnpm-workspace.yaml
2. THE Workspace_Configuration SHALL use JSON format for turbo.json and TypeScript configs
3. THE Workspace_Configuration SHALL use INI format for .editorconfig
4. THE Workspace_Configuration SHALL use JSON format for .prettierrc
5. THE Workspace_Configuration SHALL include comments explaining non-obvious configuration choices
6. WHEN configuration files are created, THE files SHALL be valid according to their respective schemas

### Requirement 10: Monorepo Best Practices

**User Story:** As a developer, I want the configuration to follow current best practices, so that the workspace is maintainable and performant.

#### Acceptance Criteria

1. THE Workspace_Configuration SHALL use hoisting for common dependencies
2. THE Workspace_Configuration SHALL prevent phantom dependencies through strict settings
3. THE TurboRepo SHALL use content-based hashing for cache invalidation
4. THE Build_Pipeline SHALL execute linting before building
5. THE Root_Package SHALL not include application-specific dependencies (only tooling)
6. WHERE a workspace package needs a shared configuration, THE package SHALL extend the root configuration rather than duplicate it
