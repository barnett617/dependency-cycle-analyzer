# Using pnpm in Dependency Cycle Analyzer

This document provides guidelines and best practices for using pnpm in the Dependency Cycle Analyzer project.

## Table of Contents
- [Installation](#installation)
- [Basic Commands](#basic-commands)
- [Workspace Commands](#workspace-commands)
- [Dependency Management](#dependency-management)
- [Troubleshooting](#troubleshooting)

## Installation

### Prerequisites
- Node.js 18.x or 20.x
- pnpm 8.x or later

### Installing pnpm
```bash
# Using npm
npm install -g pnpm

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
# Install all dependencies
pnpm install

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
```

### Adding Dependencies to Workspaces
```bash
# Add a dependency to a specific workspace
pnpm --filter @dependency-cycle-analyzer/web add <package-name>

# Add a dev dependency to a specific workspace
pnpm --filter @dependency-cycle-analyzer/web add -D <package-name>
```

### Linking Workspaces
```bash
# Link a workspace to another
pnpm --filter @dependency-cycle-analyzer/web add @dependency-cycle-analyzer/plugin@workspace:*
```

## Dependency Management

### Updating Dependencies
```bash
# Update all dependencies
pnpm update

# Update a specific package
pnpm update <package-name>

# Update dependencies in a specific workspace
pnpm --filter @dependency-cycle-analyzer/web update
```

### Checking for Updates
```bash
# Check for outdated packages
pnpm outdated

# Check for outdated packages in a specific workspace
pnpm --filter @dependency-cycle-analyzer/web outdated
```

### Cleaning
```bash
# Remove node_modules and lockfile
pnpm store prune

# Clean all workspaces
pnpm -r clean
```

## Troubleshooting

### Common Issues

1. **Peer Dependency Warnings**
   - Check if the warning is critical
   - Use `--no-strict-peer-dependencies` if needed
   - Consider updating the package versions

2. **Installation Failures**
   - Clear pnpm store: `pnpm store prune`
   - Remove node_modules: `rm -rf node_modules`
   - Reinstall: `pnpm install`

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

2. **Workspace Organization**
   - Keep common dependencies at root
   - Use workspace filtering for specific commands
   - Maintain consistent dependency versions

3. **CI/CD Integration**
   - Use `--frozen-lockfile` in CI
   - Cache pnpm store
   - Use workspace-aware commands

4. **Development Workflow**
   - Use workspace commands for development
   - Keep dependencies up to date
   - Use proper peer dependency management 