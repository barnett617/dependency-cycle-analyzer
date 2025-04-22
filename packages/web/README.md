# @dependency-cycle-analyzer/web

The standalone web application for analyzing and visualizing dependency cycles.

## Installation

```bash
npm install @dependency-cycle-analyzer/web
```

## Usage

1. Start the application:

```bash
npx @dependency-cycle-analyzer/web
```

2. Open your browser and navigate to `http://localhost:3000`

3. Paste your ESLint output into the text area. The output should be in the format:

```text
warning: Dependency cycle detected (import/no-cycle) at src/components/contentDropMenu/index.vue:64:1:
  62 | import { eventBus } from '@/manager/eventManager';
  63 | import Item from './menuItem.vue';
64 | import { ContentMenuData } from '.';
     | ^
```

The application will automatically parse the output and display:
- An interactive graph showing the dependency cycles
- Detailed information about each cycle
- The cycle path with syntax highlighting

## Features

- Parse ESLint output to detect dependency cycles
- Visualize dependency cycles using an interactive graph
- Display detailed information about each cycle
- Syntax highlighting for cycle paths
- Export analysis results
- Search and filter cycles
- Sort cycles by length or alphabetically

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## License

MIT 