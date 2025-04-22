# Next.js Integration Example

This example demonstrates how to integrate the Dependency Cycle Analyzer with a Next.js project.

## Project Setup

1. Create a new Next.js project:
```bash
pnpm create next-app@latest nextjs-with-analyzer
cd nextjs-with-analyzer
```

2. Install the analyzer plugin:
```bash
pnpm add -D @dependency-cycle-analyzer/plugin
```

## Configuration

### 1. Next.js Config
Add the analyzer to your Next.js configuration:

```javascript
// next.config.js
const DependencyCycleAnalyzer = require('@dependency-cycle-analyzer/plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.plugins.push(
        new DependencyCycleAnalyzer({
          output: 'dependency-cycles.html',
          exclude: ['node_modules'],
          threshold: 2
        })
      );
    }
    return config;
  }
};

module.exports = nextConfig;
```

### 2. ESLint Configuration
Configure ESLint to detect dependency cycles:

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'next/core-web-vitals',
    'plugin:import/recommended',
    'plugin:import/typescript'
  ],
  plugins: ['import'],
  rules: {
    'import/no-cycle': 'error',
    'import/no-unresolved': 'error'
  },
  settings: {
    'import/resolver': {
      typescript: {
        project: './tsconfig.json'
      }
    }
  }
};
```

## Example Project Structure

```
nextjs-with-analyzer/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── (routes)/
│   │       ├── dashboard/
│   │       │   ├── layout.tsx
│   │       │   ├── page.tsx
│   │       │   └── components/
│   │       │       ├── DashboardHeader.tsx
│   │       │       └── DashboardContent.tsx
│   │       └── settings/
│   │           ├── layout.tsx
│   │           ├── page.tsx
│   │           └── components/
│   │               ├── SettingsForm.tsx
│   │               └── SettingsSection.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Modal.tsx
│   │   └── layout/
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── Sidebar.tsx
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useSettings.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   └── types/
│       ├── common.ts
│       └── api.ts
├── public/
├── package.json
└── tsconfig.json
```

## Common Cycles in Next.js Projects

### 1. Layout Components
```typescript
// src/components/layout/Header.tsx
import { Sidebar } from './Sidebar';

// src/components/layout/Sidebar.tsx
import { Header } from './Header';
```

Solution: Create a shared layout context:
```typescript
// src/contexts/LayoutContext.tsx
import { createContext } from 'react';

export const LayoutContext = createContext({});

// src/components/layout/Header.tsx
import { LayoutContext } from '../../contexts/LayoutContext';

// src/components/layout/Sidebar.tsx
import { LayoutContext } from '../../contexts/LayoutContext';
```

### 2. API and Types
```typescript
// src/lib/api.ts
import { User } from '../types/api';

// src/types/api.ts
import { fetchUser } from '../lib/api';
```

Solution: Separate API types and implementation:
```typescript
// src/types/api.ts
export interface User {
  id: string;
  name: string;
}

// src/lib/api.ts
import { User } from '../types/api';

export async function fetchUser(id: string): Promise<User> {
  // Implementation
}
```

### 3. Hooks and Components
```typescript
// src/hooks/useAuth.ts
import { LoginForm } from '../components/auth/LoginForm';

// src/components/auth/LoginForm.tsx
import { useAuth } from '../../hooks/useAuth';
```

Solution: Use props for communication:
```typescript
// src/hooks/useAuth.ts
export function useAuth() {
  // Implementation
}

// src/components/auth/LoginForm.tsx
import { useAuth } from '../../hooks/useAuth';

export function LoginForm() {
  const { login } = useAuth();
  // Implementation
}
```

## Running the Analyzer

1. Add a script to package.json:
```json
{
  "scripts": {
    "analyze": "next build && eslint --ext .ts,.tsx src/ > eslint-output.txt"
  }
}
```

2. Run the analysis:
```bash
pnpm run analyze
```

3. View the results:
```bash
pnpm --filter @dependency-cycle-analyzer/web dev
```

## Best Practices for Next.js

1. **Route Organization**
   - Use the app directory structure
   - Keep route components independent
   - Share layout components through context

2. **Component Structure**
   - Organize by feature
   - Use shared components carefully
   - Avoid component-to-component cycles

3. **Data Fetching**
   - Use server components when possible
   - Keep API calls in separate files
   - Avoid mixing data fetching and UI logic

4. **State Management**
   - Use React Context for global state
   - Keep hooks focused and independent
   - Avoid hook-to-component cycles

## Integration with Next.js Features

### 1. Server Components
```typescript
// src/app/page.tsx
import { Dashboard } from '../components/Dashboard';

export default async function Home() {
  const data = await fetchData();
  return <Dashboard data={data} />;
}
```

### 2. API Routes
```typescript
// src/app/api/users/route.ts
import { User } from '../../../types/api';

export async function GET() {
  const users = await fetchUsers();
  return Response.json(users);
}
```

### 3. Middleware
```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Implementation
}
```

## Performance Considerations

1. **Bundle Analysis**
   - Use the analyzer to identify large cycles
   - Split code into smaller chunks
   - Use dynamic imports for large components

2. **Build Optimization**
   - Configure the analyzer to run in production
   - Use the output to optimize imports
   - Remove unnecessary dependencies

3. **Development Experience**
   - Run the analyzer in watch mode
   - Get real-time feedback
   - Fix cycles as they appear 