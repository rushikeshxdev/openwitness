# OpenWitness Monorepo Workspace Configuration

This document explains the monorepo workspace configuration for OpenWitness, a production-grade setup using pnpm v11, TurboRepo v2, TypeScript 5+, and Node 22 LTS.

## Workspace Structure

```
openwitness/
├── apps/                    # Applications
│   ├── api/                # Backend API server
│   └── web/                # Frontend web application
├── packages/               # Shared packages
│   ├── config/            # Shared configuration utilities
│   ├── types/             # TypeScript type definitions
│   ├── ui/                # UI component library
│   └── utils/             # Shared utility functions
├── docs/                  # Documentation
├── .editorconfig          # Cross-editor formatting rules
├── .npmrc                 # pnpm configuration
├── .prettierrc            # Code formatting rules
├── .prettierignore        # Files to exclude from formatting
├── pnpm-workspace.yaml    # Workspace package definitions
├── turbo.json             # Build orchestration configuration
├── tsconfig.base.json     # Shared TypeScript configuration
└── package.json           # Root workspace metadata
```

## Configuration Files

### pnpm-workspace.yaml

Defines which directories contain packages managed by pnpm. This file tells pnpm to treat all directories under `apps/`, `packages/`, and the `docs/` directory as workspace packages.

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'docs'
```

**What it does:**
- pnpm scans these paths for `package.json` files
- Creates symlinks in `node_modules` for workspace packages
- All packages share a single `pnpm-lock.yaml` file

### turbo.json

Configures TurboRepo for optimized build orchestration with caching and parallel execution.

```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": ["coverage/**"]
    },
    "clean": {
      "cache": false
    }
  }
}
```

**Task definitions:**
- **build**: Compiles packages, depends on dependencies being built first (`^build` means "dependencies' build tasks")
- **dev**: Runs development servers, not cached (always fresh), persistent (stays running)
- **lint**: Runs linters, depends on build outputs
- **test**: Runs tests with coverage, caches coverage reports
- **clean**: Removes build artifacts, never cached

**Caching behavior:**
- TurboRepo uses content-based hashing of inputs (source files, dependencies)
- Cached outputs stored in `.turbo/cache`
- Cache hits restore outputs without re-execution

### tsconfig.base.json

Provides shared TypeScript compiler configuration that all workspace packages extend.

Key features:
- **Strict type checking** enabled (`"strict": true`)
- **Modern JavaScript** target (ES2022)
- **Path aliases** for workspace packages (`@openwitness/*`)
- **Bundler module resolution** for modern build tools
- **Incremental compilation** for faster type checks

**How packages use it:**

Workspace packages extend the base config:
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### .prettierrc

Defines automatic code formatting rules for consistent style across all files.

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "arrowParens": "always",
  "endOfLine": "lf"
}
```

**Applies to:** JavaScript, TypeScript, JSON, Markdown, YAML, CSS files

### .editorconfig

Ensures basic formatting consistency across different code editors (VS Code, IntelliJ, Vim, etc.).

Key settings:
- UTF-8 character encoding
- LF line endings (Unix-style)
- 2-space indentation for JS/TS/JSON/YAML
- Trim trailing whitespace
- Insert final newline

### .npmrc

Controls pnpm behavior for dependency management and security.

Key settings:
```
strict-peer-dependencies=true     # Fail if peer dependencies aren't installed
auto-install-peers=false          # Require explicit peer dependency installation
shamefully-hoist=false            # Prevent phantom dependencies
enable-pre-post-scripts=false     # Security: disable untrusted scripts
```

**Why strict settings?**
- Prevents phantom dependencies (accessing packages you didn't declare)
- Makes dependency issues visible early
- Ensures reproducible builds across environments

## Workspace Scripts

All scripts are defined in the root `package.json` and orchestrated by TurboRepo:

### Development

```bash
pnpm dev
```

Starts all development servers in parallel. Each package's `dev` script runs concurrently.

**Example:**
- `apps/api` starts the backend server on port 3001
- `apps/web` starts the frontend dev server on port 3000

### Building

```bash
pnpm build
```

Builds all packages in dependency order. TurboRepo ensures dependencies are built before dependents.

**Build order example:**
1. `packages/types` (no dependencies)
2. `packages/utils` (depends on types)
3. `apps/api` (depends on utils and types)

**Caching:** If source files haven't changed, TurboRepo restores cached build outputs instantly.

### Linting

```bash
pnpm lint
```

Runs linters across all packages. Each package can define its own linting rules.

### Testing

```bash
pnpm test
```

Runs tests across all packages with coverage collection.

**Caching:** Test results are cached based on source code and test files.

### Formatting

```bash
# Check formatting without changes
pnpm format:check

# Format all files
pnpm format
```

Runs Prettier across the entire workspace. Unlike other scripts, formatting runs directly (not through TurboRepo) to format all files including config files.

### Cleaning

```bash
pnpm clean
```

Removes all build artifacts and caches:
- TurboRepo cache (`.turbo/`)
- Build outputs (`dist/`, `.next/`)
- Generated files

## Working with the Monorepo

### Adding a New Package

1. Create a new directory in `packages/` or `apps/`:
   ```bash
   mkdir packages/my-package
   cd packages/my-package
   ```

2. Initialize with `package.json`:
   ```json
   {
     "name": "@openwitness/my-package",
     "version": "0.1.0",
     "private": true,
     "main": "./dist/index.js",
     "types": "./dist/index.d.ts",
     "scripts": {
       "build": "tsc",
       "dev": "tsc --watch",
       "test": "vitest"
     }
   }
   ```

3. Create `tsconfig.json` extending the base:
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "outDir": "./dist"
     },
     "include": ["src"]
   }
   ```

4. Install dependencies and run from root:
   ```bash
   pnpm install
   pnpm dev  # TurboRepo will detect and run your package
   ```

### Using Workspace Packages

To use a workspace package in another package:

1. Add dependency in `package.json`:
   ```json
   {
     "dependencies": {
       "@openwitness/types": "workspace:*"
     }
   }
   ```

2. Import using the path alias:
   ```typescript
   import { User } from '@openwitness/types';
   ```

The `workspace:*` protocol tells pnpm to use the local workspace version.

### Extending Configurations

**TypeScript:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src"
  }
}
```

**Prettier (optional package-level `.prettierrc`):**
```json
{
  "extends": "../../.prettierrc",
  "printWidth": 80
}
```

### Running Commands in Specific Packages

```bash
# Run command in one package
pnpm --filter @openwitness/api dev

# Run command in multiple packages
pnpm --filter "@openwitness/api" --filter "@openwitness/web" build

# Run in all packages matching pattern
pnpm --filter "./apps/*" test
```

## Troubleshooting

### Issue: pnpm install fails with peer dependency errors

**Cause:** Strict peer dependency checking is enabled

**Solution:**
```bash
# Install missing peer dependencies explicitly
pnpm add <peer-dependency> -w  # -w adds to root workspace
```

**Alternative:** If the peer dependency should be in a specific package:
```bash
pnpm --filter @openwitness/my-package add <peer-dependency>
```

### Issue: TypeScript can't resolve @openwitness/* imports

**Cause:** Path aliases in `tsconfig.base.json` don't match actual package locations

**Solution:**
1. Verify the package exists at the specified path
2. Check the path in `tsconfig.base.json` points to the correct file:
   ```json
   "@openwitness/types": ["./packages/types/src/index.ts"]
   ```
3. Restart your TypeScript server (VS Code: Cmd+Shift+P → "TypeScript: Restart TS Server")

### Issue: TurboRepo cache causing stale builds

**Cause:** Cache corruption or environment-specific issues

**Solution:**
```bash
# Clear TurboRepo cache
pnpm clean

# Or manually remove
rm -rf .turbo

# Rebuild
pnpm build
```

### Issue: Build works locally but fails in CI

**Cause:** Missing dependencies or environment differences

**Solution:**
1. Ensure `pnpm-lock.yaml` is committed
2. Use frozen lockfile in CI:
   ```bash
   pnpm install --frozen-lockfile
   ```
3. Check Node.js version matches `engines` in `package.json` (>=22.0.0)
4. Verify all required environment variables are set

### Issue: "Cannot find module" errors at runtime

**Cause:** Phantom dependency (using a package you didn't declare)

**Solution:**
1. Add the dependency to your package's `package.json`:
   ```bash
   pnpm --filter @openwitness/my-package add <missing-package>
   ```
2. This is why `shamefully-hoist=false` is set - it makes these issues visible during development

### Issue: Prettier formatting conflicts with linter

**Cause:** ESLint rules conflicting with Prettier

**Solution:**
1. Install `eslint-config-prettier` in affected packages:
   ```bash
   pnpm --filter @openwitness/my-package add -D eslint-config-prettier
   ```
2. Add to ESLint config:
   ```json
   {
     "extends": ["prettier"]
   }
   ```

### Issue: Tasks running in wrong order

**Cause:** Missing task dependencies in `turbo.json`

**Solution:**
Add `dependsOn` to ensure correct order:
```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]  // Build dependencies first
    }
  }
}
```

## Best Practices

### Dependency Management

- **Use workspace protocol** for internal dependencies: `"@openwitness/types": "workspace:*"`
- **Declare all dependencies** explicitly in each package's `package.json`
- **Use exact versions** for critical dependencies: `"react": "18.3.1"` instead of `"^18.3.1"`
- **Add shared tooling** (Prettier, ESLint) to root `devDependencies`
- **Keep application dependencies** in individual packages, not root

### Configuration

- **Extend base configs** rather than duplicating them
- **Override only what's necessary** in package-specific configs
- **Document non-obvious settings** with comments
- **Commit all config files** to version control

### Scripts

- **Use TurboRepo** for task orchestration (build, test, lint)
- **Keep scripts simple** - delegate complex logic to separate tools
- **Use consistent names** across packages (build, dev, test)
- **Add clean scripts** to each package that generates outputs

### Code Organization

- **Shared code** goes in `packages/`
- **Applications** go in `apps/`
- **Keep packages focused** - one clear responsibility per package
- **Export through index files** for clean imports

### Testing

- **Run tests from root** with `pnpm test` to test all packages
- **Target specific packages** with `pnpm --filter <package> test` for faster iteration
- **Use TurboRepo caching** to skip tests for unchanged packages
- **Keep test files** next to source files (e.g., `utils.test.ts` next to `utils.ts`)

## Additional Resources

- [pnpm Workspaces Documentation](https://pnpm.io/workspaces)
- [TurboRepo Documentation](https://turbo.build/repo/docs)
- [TypeScript Project References](https://www.typescriptlang.org/docs/handbook/project-references.html)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
- [EditorConfig](https://editorconfig.org/)

## Questions?

If you encounter issues not covered in this guide:

1. Check the tool's documentation (pnpm, TurboRepo, TypeScript)
2. Review the configuration files in the workspace root
3. Ask in team chat or create an issue in the repository
