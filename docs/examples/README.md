# Examples

This directory contains various examples demonstrating how to use the Dependency Cycle Analyzer in different scenarios.

## Table of Contents
- [Web Application Examples](#web-application-examples)
- [Plugin Integration Examples](#plugin-integration-examples)
- [Common Use Cases](#common-use-cases)

## Web Application Examples

### Basic Usage
1. Start the web application:
```bash
pnpm --filter @dependency-cycle-analyzer/web dev
```

2. Open your browser to `http://localhost:5173`

3. Upload your project files or paste ESLint output to analyze dependency cycles.

### Analyzing a React Project
```bash
# In your React project directory
npx eslint --ext .js,.jsx,.ts,.tsx src/ > eslint-output.txt

# Open the web app and upload eslint-output.txt
```

### Analyzing a Vue Project
```bash
# In your Vue project directory
npx eslint --ext .js,.jsx,.ts,.tsx,.vue src/ > eslint-output.txt

# Open the web app and upload eslint-output.txt
```

## Plugin Integration Examples

### Webpack Integration
1. Install the plugin:
```bash
pnpm add -D @dependency-cycle-analyzer/plugin
```

2. Add to webpack.config.js:
```javascript
const DependencyCycleAnalyzer = require('@dependency-cycle-analyzer/plugin');

module.exports = {
  // ... other config
  plugins: [
    new DependencyCycleAnalyzer({
      output: 'dependency-cycles.html',
      exclude: ['node_modules'],
      threshold: 3 // Minimum cycle length to report
    })
  ]
};
```

### Vite Integration
1. Install the plugin:
```bash
pnpm add -D @dependency-cycle-analyzer/plugin
```

2. Add to vite.config.ts:
```typescript
import { defineConfig } from 'vite';
import DependencyCycleAnalyzer from '@dependency-cycle-analyzer/plugin';

export default defineConfig({
  plugins: [
    DependencyCycleAnalyzer({
      output: 'dependency-cycles.html',
      exclude: ['node_modules'],
      threshold: 3
    })
  ]
});
```

## Common Use Cases

### 1. CI/CD Integration
Add the analyzer to your CI pipeline to catch dependency cycles before they reach production:

```yaml
# .github/workflows/ci.yml
jobs:
  analyze:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: pnpm install
      - run: pnpm run build
      - run: |
          npx eslint --ext .js,.jsx,.ts,.tsx src/ > eslint-output.txt
          pnpm --filter @dependency-cycle-analyzer/web analyze eslint-output.txt
```

### 2. Large Monorepo Analysis
Analyze dependency cycles across multiple packages in a monorepo:

```bash
# Analyze all packages
pnpm -r --filter "./packages/*" exec eslint --ext .js,.jsx,.ts,.tsx src/ > all-eslint-output.txt

# Open the web app and upload all-eslint-output.txt
```

### 3. Custom Analysis Rules
Configure the analyzer to focus on specific types of cycles:

```javascript
// webpack.config.js
new DependencyCycleAnalyzer({
  output: 'dependency-cycles.html',
  rules: {
    // Only report cycles involving UI components
    include: ['src/components/**/*'],
    // Ignore cycles in test files
    exclude: ['**/*.test.*', '**/*.spec.*'],
    // Custom cycle detection logic
    customDetector: (importPath) => {
      return importPath.includes('@shared/');
    }
  }
});
```

### 4. Integration with Other Tools
Combine with other analysis tools for comprehensive code quality checks:

```bash
# Run multiple analysis tools
pnpm add -D @dependency-cycle-analyzer/plugin eslint-plugin-import

# Configure ESLint
// .eslintrc.js
module.exports = {
  plugins: ['import'],
  rules: {
    'import/no-cycle': 'error',
    'import/no-unresolved': 'error'
  }
};

# Run analysis
npx eslint --ext .js,.jsx,.ts,.tsx src/ > analysis.txt
```

### 5. Custom Visualization
Extend the visualization with custom styles and interactions:

```typescript
// In your project
import { DependencyGraph } from '@dependency-cycle-analyzer/web';

const graph = new DependencyGraph({
  container: document.getElementById('graph'),
  options: {
    nodes: {
      shape: 'box',
      color: {
        background: '#ffffff',
        border: '#2B7CE9',
        highlight: {
          background: '#D2E5FF',
          border: '#2B7CE9'
        }
      }
    },
    edges: {
      arrows: 'to',
      smooth: {
        type: 'cubicBezier'
      }
    }
  }
});

// Load and visualize cycles
graph.loadCycles(cyclesData);
```

### 6. Automated Reporting
Generate periodic reports of dependency cycles:

```bash
# Add to package.json scripts
{
  "scripts": {
    "analyze:daily": "eslint --ext .js,.jsx,.ts,.tsx src/ > eslint-output.txt && node scripts/generate-report.js"
  }
}

# Create a report generation script
// scripts/generate-report.js
const { analyze } = require('@dependency-cycle-analyzer/plugin');
const fs = require('fs');

const output = analyze('eslint-output.txt', {
  format: 'html',
  output: 'reports/dependency-cycles.html'
});

// Send report via email or upload to dashboard
```

### 7. Performance Optimization
Use the analyzer to identify and optimize performance bottlenecks:

```javascript
// webpack.config.js
new DependencyCycleAnalyzer({
  output: 'dependency-cycles.html',
  performance: {
    // Track import times
    trackImportTime: true,
    // Set threshold for slow imports
    slowImportThreshold: 100, // milliseconds
    // Generate flame graph
    generateFlameGraph: true
  }
});
```

These examples demonstrate various ways to integrate and use the Dependency Cycle Analyzer in different scenarios. For more specific use cases or custom configurations, please refer to the API documentation or open an issue. 