# Dependency Cycle Analyzer

A tool to detect and visualize dependency cycles in your codebase. This project consists of two packages:

- A standalone web application for visualizing dependency cycles
- A build tool plugin for analyzing dependency cycles in your projects

## Features

- Detect dependency cycles in your codebase
- Visualize dependency graphs
- Support for multiple build tools (webpack, vite)
- Modern, responsive web interface
- Offline support with PWA

## Prerequisites

- Node.js 18.x or 20.x
- pnpm 8.x or later

## Installation

1. Install pnpm globally:

```bash
npm install -g pnpm
```

2. Clone the repository:

```bash
git clone https://github.com/yourusername/dependency-cycle-analyzer.git
cd dependency-cycle-analyzer
```

3. Install dependencies:

```bash
pnpm install
```

## Development

### Web Application

```bash
# Start development server
pnpm --filter @dependency-cycle-analyzer/web dev

# Build for production
pnpm --filter @dependency-cycle-analyzer/web build

# Preview production build
pnpm --filter @dependency-cycle-analyzer/web preview
```

### Plugin Development

```bash
# Start development server
pnpm --filter @dependency-cycle-analyzer/plugin dev

# Build for production
pnpm --filter @dependency-cycle-analyzer/plugin build
```

### Testing

```bash
# Run all tests
pnpm test

# Run web tests
pnpm --filter @dependency-cycle-analyzer/web test

# Run plugin tests
pnpm --filter @dependency-cycle-analyzer/plugin test

# Generate coverage reports
pnpm test:coverage
```

## Project Structure

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
├── docs/               # Documentation
└── pnpm-workspace.yaml # pnpm workspace configuration
```

## Using pnpm

This project uses pnpm for package management. For detailed information about using pnpm in this project, see [docs/pnpm.md](docs/pnpm.md).

Key pnpm commands:

```bash
# Install dependencies
pnpm install

# Add a new dependency
pnpm add <package-name>

# Add a dev dependency
pnpm add -D <package-name>

# Run workspace commands
pnpm --filter <workspace-name> <command>
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to contribute to this project.

## License

MIT

## Packages

This monorepo contains two packages:

1. [@dependency-cycle-analyzer/web](./packages/web/README.md) - The standalone web application
2. [@dependency-cycle-analyzer/plugin](./packages/plugin/README.md) - The build tool plugin

## Installation

```bash
# Install the web app
npm install @dependency-cycle-analyzer/web

# Install the plugin
npm install --save-dev @dependency-cycle-analyzer/plugin
```

## Development

```bash
# Install dependencies
npm install

# Start the web app in development mode
npm run dev

# Build all packages
npm run build
```

## License

MIT

## Features

- Parse ESLint output to detect dependency cycles
- Visualize dependency cycles using an interactive graph
- Display detailed information about each cycle
- Syntax highlighting for cycle paths

## Usage

- Start the development server:

```bash
npm start
```

- Open your browser and navigate to `http://localhost:3000`

- Paste your ESLint output into the text area. The output should be in the format:

```text
warning: Dependency cycle detected (import/no-cycle) at src/components/contentDropMenu/index.vue:64:1:
  62 | import { eventBus } from '@/manager/eventManager';
  63 | import Item from './menuItem.vue';
64 | import { ContentMenuData } from '.';
     | ^
```

- The application will automatically parse the output and display:

  - An interactive graph showing the dependency cycles
  - Detailed information about each cycle
  - The cycle path with syntax highlighting

## Example

Input:

```text
warning: Dependency cycle detected (import/no-cycle) at src/components/contentDropMenu/index.vue:64:1:
  62 | import { eventBus } from '@/manager/eventManager';
  63 | import Item from './menuItem.vue';
64 | import { ContentMenuData } from '.';
     | ^
```

Output:

- A graph showing the cycle between the files
- Details about the cycle including file path, line number, and the complete cycle path

## Tech Stacks

The application is built using:

- React
- TypeScript
- Vite
- vis-network for graph visualization
- react-syntax-highlighter for code highlighting
