# Publishing Guide

This guide explains how to publish the Dependency Cycle Analyzer packages to npm.

## Prerequisites

1. An npm account
2. Node.js and pnpm installed
3. Access to the repository
4. NPM_TOKEN secret configured in GitHub repository

## Publishing Steps

### 1. Prepare the Package

1. Update the version in both package.json files:
```bash
# Update plugin version
cd packages/plugin
pnpm version [major|minor|patch]

# Update web version
cd ../web
pnpm version [major|minor|patch]
```

2. Update the changelog in `CHANGELOG.md` with the new version and changes.

3. Build the packages:
```bash
pnpm run build
```

### 2. Create a Release

1. Create and push a new tag:
```bash
git tag v1.0.0  # Replace with your version
git push origin v1.0.0
```

2. The CI workflow will automatically:
   - Run tests
   - Build packages
   - Publish to npm
   - Create a GitHub release

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

## CI/CD Integration

The project uses GitHub Actions for automated publishing. The workflow is defined in `.github/workflows/ci.yml` and includes:

1. **Test Job**
   - Runs on Node.js 18.x and 20.x
   - Installs dependencies with pnpm
   - Runs linting and tests
   - Uploads coverage reports

2. **Build Job**
   - Builds all packages
   - Uploads build artifacts

3. **Release Job**
   - Triggers on tag pushes (v*)
   - Downloads build artifacts
   - Publishes packages to npm
   - Creates GitHub release

## Best Practices

1. **Version Management**
   - Use semantic versioning
   - Update CHANGELOG.md for each release
   - Tag releases in git
   - Keep versions in sync between packages

2. **Quality Assurance**
   - Run tests before creating a release
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
   - Verify NPM_TOKEN secret is configured
   - Check npm token permissions
   - Ensure correct registry URL

2. **Version Conflicts**
   - Check existing versions
   - Verify version number format
   - Clear npm cache if needed

3. **Publish Failures**
   - Check package.json format
   - Verify build process
   - Review GitHub Actions logs

### Support

For publishing issues:
1. Check GitHub Actions logs
2. Review npm documentation
3. Contact repository maintainers if needed 