# Using pnpm in Dependency Cycle Analyzer

This document provides guidelines and best practices for using pnpm in the Dependency Cycle Analyzer project.

## Table of Contents
- [Installation](#installation)
- [Basic Commands](#basic-commands)
- [Workspace Commands](#workspace-commands)
- [Dependency Management](#dependency-management)
- [CI/CD Integration](#cicd-integration)
- [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites
- Node.js 18.x or 20.x
- pnpm 8.15.4 or later

### Installing pnpm
```bash
# Using npm
npm install -g pnpm@8.15.4

# Using curl
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

### Verifying Installation
```bash
pnpm --version
```

## Basic Commands

### Installing Dependencies
```bash
# Install all dependencies with frozen lockfile (recommended for CI)
pnpm install --frozen-lockfile

# Install a new dependency
pnpm add <package-name>

# Install a dev dependency
pnpm add -D <package-name>

# Install a peer dependency
pnpm add --save-peer <package-name>
```

### Running Scripts
```bash
# Run a script from root package.json
pnpm run <script-name>

# Run a script in a specific workspace
pnpm --filter <workspace-name> run <script-name>

# Run tests
pnpm run test

# Run linting
pnpm run lint

# Build all packages
pnpm run build
```

## Workspace Commands

### Working with Workspaces
```bash
# List all workspaces
pnpm -r list

# Run a command in all workspaces
pnpm -r <command>

# Run a command in specific workspaces
pnpm --filter <workspace-name> <command>

# Run a command in web package
pnpm --filter @dependency-cycle-analyzer/web <command>

# Run a command in plugin package
pnpm --filter @dependency-cycle-analyzer/plugin <command>
```

### Adding Dependencies to Workspaces
```bash
# Add a dependency to web package
pnpm --filter @dependency-cycle-analyzer/web add <package-name>

# Add a dev dependency to plugin package
pnpm --filter @dependency-cycle-analyzer/plugin add -D <package-name>
```

### Linking Workspaces
```bash
# Link plugin to web
pnpm --filter @dependency-cycle-analyzer/web add @dependency-cycle-analyzer/plugin@workspace:*
```

## Dependency Management

### Updating Dependencies
```bash
# Update all dependencies
pnpm update

# Update a specific package
pnpm update <package-name>

# Update dependencies in web package
pnpm --filter @dependency-cycle-analyzer/web update

# Update dependencies in plugin package
pnpm --filter @dependency-cycle-analyzer/plugin update
```

### Checking for Updates
```bash
# Check for outdated packages
pnpm outdated

# Check for outdated packages in web package
pnpm --filter @dependency-cycle-analyzer/web outdated

# Check for outdated packages in plugin package
pnpm --filter @dependency-cycle-analyzer/plugin outdated
```

### Cleaning
```bash
# Remove node_modules and lockfile
pnpm store prune

# Clean all workspaces
pnpm -r clean
```

## CI/CD Integration

The project uses GitHub Actions with pnpm for CI/CD. Key points:

1. **Dependency Installation**
   ```yaml
   - name: Install pnpm
     uses: pnpm/action-setup@v2
     with:
       version: 8.15.4
   
   - name: Install dependencies
     run: pnpm install --frozen-lockfile
   ```

2. **Cache Configuration**
   ```yaml
   - uses: actions/setup-node@v4
     with:
       node-version: '20.x'
       cache: 'pnpm'
   ```

3. **Workspace Commands**
   - Use `pnpm -r` for running commands in all workspaces
   - Use `pnpm --filter` for specific workspace commands
   - Build artifacts are shared between jobs

## Troubleshooting

### Common Issues

1. **Peer Dependency Warnings**
   - Check if the warning is critical
   - Use `--no-strict-peer-dependencies` if needed
   - Consider updating the package versions

2. **Installation Failures**
   - Clear pnpm store: `pnpm store prune`
   - Remove node_modules: `rm -rf node_modules`
   - Reinstall: `pnpm install --frozen-lockfile`

3. **Workspace Resolution Issues**
   - Ensure workspace protocol is used: `@workspace:*`
   - Check .npmrc configuration
   - Verify workspace dependencies

### Performance Tips

1. **Use the Store**
   - pnpm uses a content-addressable store
   - Reuses packages across projects
   - Saves disk space

2. **Parallel Installation**
   - pnpm installs dependencies in parallel
   - Faster than npm or yarn

3. **Workspace Optimization**
   - Use workspace protocol for internal dependencies
   - Share common dependencies at root level
   - Use public-hoist-pattern for development tools

## Best Practices

1. **Version Management**
   - Use exact versions in package.json
   - Update dependencies regularly
   - Use workspace protocol for internal packages
   - Keep versions in sync between packages

2. **Workspace Organization**
   - Keep common dependencies at root
   - Use workspace filtering for specific commands
   - Maintain consistent dependency versions

3. **CI/CD Integration**
   - Use `--frozen-lockfile` in CI
   - Cache pnpm store
   - Use workspace-aware commands
   - Share build artifacts between jobs

4. **Development Workflow**
   - Use workspace commands for development
   - Keep dependencies up to date
   - Use proper peer dependency management
   - Test changes in all affected workspaces 