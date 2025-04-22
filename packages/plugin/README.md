# @dependency-cycle-analyzer/plugin

A build tool plugin to analyze and visualize dependency cycles in your codebase.

## Installation

```bash
npm install --save-dev @dependency-cycle-analyzer/plugin
```

## Usage

### Vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import { DependencyCycleAnalyzerPlugin } from '@dependency-cycle-analyzer/plugin'

export default defineConfig({
  plugins: [
    new DependencyCycleAnalyzerPlugin({
      outputDir: 'dependency-cycle-report',
      open: true,
      port: 3000
    }).vite()
  ]
})
```

### Webpack

```javascript
// webpack.config.js
const DependencyCycleAnalyzerPlugin = require('@dependency-cycle-analyzer/plugin');

module.exports = {
  plugins: [
    new DependencyCycleAnalyzerPlugin({
      outputDir: 'dependency-cycle-report',
      open: true,
      port: 3000
    }).webpack()
  ]
}
```

## Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outputDir` | string | 'dependency-cycle-report' | Output directory for the analysis report |
| `open` | boolean | true | Whether to open the report in browser automatically |
| `port` | number | 3000 | Port to serve the report on |

## Features

- Automatically detects dependency cycles during build
- Generates an interactive visualization of the cycles
- Provides detailed information about each cycle
- Syntax highlighting for cycle paths
- Search and filter functionality
- Export analysis results

## Development

```bash
# Install dependencies
npm install

# Build the plugin
npm run build

# Watch for changes
npm run dev
```

## License

MIT 