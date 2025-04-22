# Publishing Guide

This guide explains how to publish the Dependency Cycle Analyzer plugin to npm.

## Prerequisites

1. An npm account
2. Node.js and pnpm installed
3. Access to the repository

## Publishing Steps

### 1. Prepare the Package

1. Update the version in `packages/plugin/package.json`:
```bash
cd packages/plugin
pnpm version [major|minor|patch]
```

2. Update the changelog in `CHANGELOG.md` with the new version and changes.

3. Build the package:
```bash
pnpm run build
```

### 2. Configure npm

1. Login to npm:
```bash
npm login
```

2. Verify your npm account:
```bash
npm whoami
```

### 3. Publish the Package

1. Publish the plugin:
```bash
cd packages/plugin
npm publish --access public
```

2. Verify the publication:
```bash
npm view @dependency-cycle-analyzer/plugin
```

## Publishing Workflow

### 1. Versioning

Follow semantic versioning (semver):
- `major`: Breaking changes
- `minor`: New features (backwards compatible)
- `patch`: Bug fixes (backwards compatible)

Example:
```bash
# For a breaking change
pnpm version major

# For a new feature
pnpm version minor

# For a bug fix
pnpm version patch
```

### 2. Pre-release Versions

For beta or alpha releases:
```bash
# For a beta release
pnpm version prerelease --preid beta

# For an alpha release
pnpm version prerelease --preid alpha
```

### 3. Tagging

Use npm tags to manage different versions:
```bash
# Publish as latest
npm publish --tag latest

# Publish as beta
npm publish --tag beta
```

## CI/CD Integration

Add publishing to your CI workflow:

```yaml
# .github/workflows/publish.yml
name: Publish

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          registry-url: 'https://registry.npmjs.org'
      - run: pnpm install
      - run: pnpm run build
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## Best Practices

1. **Version Management**
   - Use semantic versioning
   - Update CHANGELOG.md for each release
   - Tag releases in git

2. **Quality Assurance**
   - Run tests before publishing
   - Verify the build works
   - Check documentation is up to date

3. **Security**
   - Use npm tokens for CI/CD
   - Keep dependencies updated
   - Review package contents

4. **Documentation**
   - Update README.md
   - Include usage examples
   - Document breaking changes

## Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify npm login
   - Check npm token permissions
   - Ensure correct registry URL

2. **Version Conflicts**
   - Check existing versions
   - Verify version number format
   - Clear npm cache if needed

3. **Publish Failures**
   - Check package.json format
   - Verify build process
   - Review npm logs

### Support

For publishing issues:
1. Check npm documentation
2. Review npm logs
3. Contact npm support if needed 