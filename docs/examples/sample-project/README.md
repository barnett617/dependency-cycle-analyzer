# Sample Project

This is a sample project demonstrating common dependency cycle scenarios and how to analyze them using the Dependency Cycle Analyzer.

## Project Structure

```
sample-project/
├── src/
│   ├── components/
│   │   ├── Button/
│   │   │   ├── Button.tsx
│   │   │   ├── ButtonGroup.tsx
│   │   │   └── ButtonIcon.tsx
│   │   ├── Modal/
│   │   │   ├── Modal.tsx
│   │   │   └── ModalHeader.tsx
│   │   └── Form/
│   │       ├── Form.tsx
│   │       ├── FormField.tsx
│   │       └── FormSubmit.tsx
│   ├── hooks/
│   │   ├── useModal.ts
│   │   └── useForm.ts
│   ├── utils/
│   │   ├── validation.ts
│   │   └── formatting.ts
│   └── types/
│       ├── common.ts
│       └── api.ts
├── package.json
└── tsconfig.json
```

## Dependency Cycles

This project intentionally includes several types of dependency cycles for demonstration purposes:

1. **Component Cycle**
   - Button.tsx → ButtonGroup.tsx → Button.tsx
   - Demonstrates a common UI component cycle

2. **Hook Cycle**
   - useModal.ts → Modal.tsx → useModal.ts
   - Shows a cycle between hooks and components

3. **Utility Cycle**
   - validation.ts → formatting.ts → validation.ts
   - Illustrates a cycle between utility functions

4. **Type Definition Cycle**
   - common.ts → api.ts → common.ts
   - Demonstrates type definition cycles

## Analyzing the Project

### Using the Web Application

1. Generate ESLint output:
```bash
npx eslint --ext .ts,.tsx src/ > eslint-output.txt
```

2. Open the web application and upload the output file.

3. View the visualization of dependency cycles.

### Using the Plugin

1. Install the plugin:
```bash
pnpm add -D @dependency-cycle-analyzer/plugin
```

2. Configure webpack or vite:
```javascript
// webpack.config.js
const DependencyCycleAnalyzer = require('@dependency-cycle-analyzer/plugin');

module.exports = {
  plugins: [
    new DependencyCycleAnalyzer({
      output: 'dependency-cycles.html',
      exclude: ['node_modules'],
      threshold: 2
    })
  ]
};
```

3. Run the build:
```bash
pnpm run build
```

## Fixing Cycles

### 1. Component Cycle
Before:
```typescript
// Button.tsx
import { ButtonGroup } from './ButtonGroup';

// ButtonGroup.tsx
import { Button } from './Button';
```

After:
```typescript
// Button.tsx
// Remove ButtonGroup import

// ButtonGroup.tsx
import { Button } from './Button';
```

### 2. Hook Cycle
Before:
```typescript
// useModal.ts
import { Modal } from '../components/Modal';

// Modal.tsx
import { useModal } from '../../hooks/useModal';
```

After:
```typescript
// useModal.ts
// Remove Modal import, use props instead

// Modal.tsx
import { useModal } from '../../hooks/useModal';
```

### 3. Utility Cycle
Before:
```typescript
// validation.ts
import { formatValue } from './formatting';

// formatting.ts
import { validateValue } from './validation';
```

After:
```typescript
// validation.ts
// Move shared logic to a new file

// formatting.ts
// Move shared logic to a new file

// shared.ts
// New file with shared logic
```

### 4. Type Definition Cycle
Before:
```typescript
// common.ts
import { ApiResponse } from './api';

// api.ts
import { CommonType } from './common';
```

After:
```typescript
// types.ts
// New file with all shared types

// common.ts
import { CommonType } from './types';

// api.ts
import { ApiResponse } from './types';
```

## Best Practices

1. **Component Organization**
   - Keep components independent
   - Use props for communication
   - Avoid circular imports

2. **Hook Usage**
   - Keep hooks focused
   - Use props for component communication
   - Avoid hook-to-component cycles

3. **Utility Functions**
   - Organize by domain
   - Create shared utilities
   - Avoid utility cycles

4. **Type Definitions**
   - Centralize shared types
   - Use type imports carefully
   - Avoid type definition cycles

## Running the Example

1. Clone the repository
2. Install dependencies:
```bash
pnpm install
```

3. Run the analyzer:
```bash
pnpm run analyze
```

4. View the results in your browser at `http://localhost:5173` 