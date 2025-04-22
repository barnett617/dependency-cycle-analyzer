# Contributing to Dependency Cycle Analyzer

Thank you for your interest in contributing to the Dependency Cycle Analyzer project! This document provides guidelines and instructions for contributing to both the web application and plugin packages.

## Table of Contents

- [Contributing to Dependency Cycle Analyzer](#contributing-to-dependency-cycle-analyzer)
  - [Table of Contents](#table-of-contents)
  - [Development Setup](#development-setup)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
  - [Project Structure](#project-structure)
  - [Development Workflow](#development-workflow)
    - [Web Application](#web-application)
    - [Plugin Development](#plugin-development)
  - [Testing](#testing)
    - [Running Tests](#running-tests)
    - [Test Coverage](#test-coverage)
    - [Writing Tests](#writing-tests)
  - [Code Style](#code-style)
  - [Documentation](#documentation)
    - [Writing Documentation](#writing-documentation)
    - [Examples](#examples)
  - [Release Process](#release-process)
  - [Questions?](#questions)

## Development Setup

### Prerequisites

- Node.js 18.x or 20.x
- npm 9.x or later
- Git

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/dependency-cycle-analyzer.git
cd dependency-cycle-analyzer
```

2. Install dependencies:

```bash
npm install
```

3. Build all packages:

```bash
npm run build
```

## Project Structure

The project is organized as a monorepo with the following structure:

```
dependency-cycle-analyzer/
├── packages/
│   ├── web/              # Standalone web application
│   │   ├── src/         # Source code
│   │   ├── public/      # Static assets
│   │   └── tests/       # Test files
│   └── plugin/          # Build tool plugin
│       ├── src/         # Source code
│       └── tests/       # Test files
├── .github/             # GitHub Actions workflows
└── docs/               # Documentation
```

## Development Workflow

### Web Application

1. Start the development server:

```bash
npm run dev --workspace @dependency-cycle-analyzer/web
```

2. The application will be available at `http://localhost:5173`

### Plugin Development

1. Start the development server:

```bash
npm run dev --workspace @dependency-cycle-analyzer/plugin
```

2. Link the plugin to test it in a real project:

```bash
cd packages/plugin
npm link
cd /path/to/your/project
npm link @dependency-cycle-analyzer/plugin
```

## Testing

### Running Tests

- Run all tests: `npm test`
- Run web tests: `npm test --workspace @dependency-cycle-analyzer/web`
- Run plugin tests: `npm test --workspace @dependency-cycle-analyzer/plugin`

### Test Coverage

- Generate coverage reports: `npm run test:coverage`
- Coverage reports are available in `packages/*/coverage/`

### Writing Tests

- Place test files next to the source files with `.test.ts` or `.test.tsx` extension
- Use `@testing-library/react` for React components
- Follow the existing test patterns in the codebase

## Code Style

- Use TypeScript for all new code
- Follow ESLint and Prettier configurations
- Write meaningful commit messages
- Keep functions and components small and focused
- Add appropriate comments and documentation

## Documentation

### Writing Documentation

- Update README files when adding new features
- Add JSDoc comments for public APIs
- Keep examples up to date
- Document breaking changes

### Examples

- Add examples for new features
- Test examples before committing
- Keep examples simple and focused

## Release Process

1. Update version numbers in package.json files
2. Update CHANGELOG.md
3. Create a new tag: `git tag vX.Y.Z`
4. Push the tag: `git push origin vX.Y.Z`
5. GitHub Actions will handle the release process

## Questions?

Feel free to open an issue or reach out to the maintainers for any questions or clarifications.
