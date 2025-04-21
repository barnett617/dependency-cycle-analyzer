# Dependency Cycle Analyzer

A tool to analyze and visualize dependency cycles from ESLint output.

## Features

- Parse ESLint output to detect dependency cycles
- Visualize dependency cycles using an interactive graph
- Display detailed information about each cycle
- Syntax highlighting for cycle paths

## Installation

1. Clone the repository

1. Install dependencies:

```bash
npm install
```

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

## Development

The application is built using:

- React
- TypeScript
- Vite
- vis-network for graph visualization
- react-syntax-highlighter for code highlighting
