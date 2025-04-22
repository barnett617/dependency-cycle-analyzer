# Vue.js Integration Example

This example demonstrates how to integrate the Dependency Cycle Analyzer with a Vue.js project using Vue 3 and Vite.

## Project Setup

1. Create a new Vue.js project:
```bash
pnpm create vue@latest vue-with-analyzer
cd vue-with-analyzer
```

2. Install the analyzer plugin:
```bash
pnpm add -D @dependency-cycle-analyzer/plugin
```

## Configuration

### 1. Vite Configuration
Add the analyzer to your Vite configuration:

```javascript
// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import DependencyCycleAnalyzer from '@dependency-cycle-analyzer/plugin';

export default defineConfig({
  plugins: [
    vue(),
    DependencyCycleAnalyzer({
      output: 'dependency-cycles.html',
      exclude: ['node_modules'],
      threshold: 2
    })
  ]
});
```

### 2. ESLint Configuration
Configure ESLint to detect dependency cycles:

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'plugin:vue/vue3-recommended',
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
vue-with-analyzer/
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   └── Modal.vue
│   │   ├── layout/
│   │   │   ├── Header.vue
│   │   │   ├── Footer.vue
│   │   │   └── Sidebar.vue
│   │   └── features/
│   │       ├── dashboard/
│   │       │   ├── Dashboard.vue
│   │       │   ├── DashboardHeader.vue
│   │       │   └── DashboardContent.vue
│   │       └── settings/
│   │           ├── Settings.vue
│   │           ├── SettingsForm.vue
│   │           └── SettingsSection.vue
│   ├── composables/
│   │   ├── useAuth.ts
│   │   ├── useTheme.ts
│   │   └── useSettings.ts
│   ├── stores/
│   │   ├── auth.ts
│   │   ├── theme.ts
│   │   └── settings.ts
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.ts
│   │   └── utils.ts
│   ├── types/
│   │   ├── common.ts
│   │   └── api.ts
│   ├── App.vue
│   └── main.ts
├── public/
├── package.json
└── tsconfig.json
```

## Common Cycles in Vue.js Projects

### 1. Component Dependencies
```vue
<!-- src/components/layout/Header.vue -->
<script setup>
import Sidebar from './Sidebar.vue';
</script>

<!-- src/components/layout/Sidebar.vue -->
<script setup>
import Header from './Header.vue';
</script>
```

Solution: Use a shared layout store:
```typescript
// src/stores/layout.ts
import { defineStore } from 'pinia';

export const useLayoutStore = defineStore('layout', {
  state: () => ({
    isSidebarOpen: false
  })
});

<!-- src/components/layout/Header.vue -->
<script setup>
import { useLayoutStore } from '../../stores/layout';
const layout = useLayoutStore();
</script>

<!-- src/components/layout/Sidebar.vue -->
<script setup>
import { useLayoutStore } from '../../stores/layout';
const layout = useLayoutStore();
</script>
```

### 2. Store and Service Dependencies
```typescript
// src/stores/auth.ts
import { login } from '../services/auth';

// src/services/auth.ts
import { useAuthStore } from '../stores/auth';
```

Solution: Separate concerns:
```typescript
// src/services/auth.ts
export async function login(credentials: Credentials) {
  // Implementation
}

// src/stores/auth.ts
import { defineStore } from 'pinia';
import { login } from '../services/auth';

export const useAuthStore = defineStore('auth', {
  actions: {
    async login(credentials: Credentials) {
      await login(credentials);
    }
  }
});
```

### 3. Composable and Component Dependencies
```typescript
// src/composables/useAuth.ts
import LoginForm from '../components/auth/LoginForm.vue';

// src/components/auth/LoginForm.vue
<script setup>
import { useAuth } from '../../composables/useAuth';
</script>
```

Solution: Use props and events:
```typescript
// src/composables/useAuth.ts
export function useAuth() {
  // Implementation
}

<!-- src/components/auth/LoginForm.vue -->
<script setup>
import { useAuth } from '../../composables/useAuth';
const { login } = useAuth();
</script>
```

## Running the Analyzer

1. Add a script to package.json:
```json
{
  "scripts": {
    "analyze": "vite build && eslint --ext .ts,.vue src/ > eslint-output.txt"
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

## Best Practices for Vue.js

1. **Component Organization**
   - Use feature-based organization
   - Keep components focused and small
   - Avoid component-to-component cycles

2. **State Management**
   - Use Pinia for global state
   - Keep stores independent
   - Avoid store-to-store cycles

3. **Composables**
   - Keep composables focused
   - Use props and events for communication
   - Avoid composable-to-component cycles

4. **Services**
   - Keep services independent
   - Use dependency injection
   - Avoid service-to-service cycles

## Integration with Vue.js Features

### 1. Composition API
```typescript
// src/composables/useData.ts
import { ref, onMounted } from 'vue';

export function useData() {
  const data = ref(null);
  
  onMounted(async () => {
    data.value = await fetchData();
  });
  
  return { data };
}
```

### 2. Pinia Stores
```typescript
// src/stores/user.ts
import { defineStore } from 'pinia';
import { fetchUser } from '../services/api';

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null
  }),
  actions: {
    async fetchUser(id: string) {
      this.user = await fetchUser(id);
    }
  }
});
```

### 3. Vue Router
```typescript
// src/router/index.ts
import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/dashboard',
      component: () => import('../components/Dashboard.vue'),
      meta: { requiresAuth: true }
    }
  ]
});

router.beforeEach((to, from, next) => {
  const auth = useAuthStore();
  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    next('/login');
  } else {
    next();
  }
});
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