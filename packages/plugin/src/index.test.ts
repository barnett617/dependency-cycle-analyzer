import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DependencyCycleAnalyzerPlugin } from './index';

// Mock dependencies
vi.mock('fs-extra');
vi.mock('open');
vi.mock('vite', () => ({
  createServer: vi.fn().mockReturnValue({
    listen: vi.fn().mockResolvedValue(undefined),
  }),
}));

describe('DependencyCycleAnalyzerPlugin', () => {
  let plugin: DependencyCycleAnalyzerPlugin;

  beforeEach(() => {
    vi.clearAllMocks();
    plugin = new DependencyCycleAnalyzerPlugin();
  });

  describe('constructor', () => {
    it('sets default options', () => {
      const defaultPlugin = new DependencyCycleAnalyzerPlugin();
      expect(defaultPlugin).toBeDefined();
    });

    it('accepts custom options', () => {
      const customPlugin = new DependencyCycleAnalyzerPlugin({
        outputDir: 'custom-dir',
        open: false,
        port: 4000,
      });
      expect(customPlugin).toBeDefined();
    });
  });

  describe('addCyclesFromESLint', () => {
    it('parses ESLint output and adds cycles', () => {
      const output = `
Dependency cycle detected at /path/to/file.ts:1:1
import { foo } from './bar';
import { bar } from './baz';
import { baz } from './foo';

Dependency cycle detected at /path/to/another.ts:2:3
import { x } from './y';
import { y } from './z';
import { z } from './x';
`;

      plugin.addCyclesFromESLint(output);

      expect(plugin['cycles']).toHaveLength(2);
      expect(plugin['cycles'][0]).toEqual({
        file: '/path/to/file.ts',
        line: 1,
        column: 1,
        cyclePath: ['./bar', './baz', './foo'],
        codeContext:
          "import { foo } from './bar';\nimport { bar } from './baz';\nimport { baz } from './foo';\n",
      });
    });

    it('handles empty output', () => {
      plugin.addCyclesFromESLint('');
      expect(plugin['cycles']).toHaveLength(0);
    });
  });

  describe('vite plugin', () => {
    it('returns a valid Vite plugin', () => {
      const vitePlugin = plugin.vite();
      expect(vitePlugin).toHaveProperty('name', 'dependency-cycle-analyzer');
      expect(vitePlugin).toHaveProperty('enforce', 'post');
      expect(vitePlugin).toHaveProperty('buildEnd');
    });
  });

  describe('webpack plugin', () => {
    it('returns a valid Webpack plugin', () => {
      const webpackPlugin = plugin.webpack();
      expect(webpackPlugin).toHaveProperty('name', 'DependencyCycleAnalyzerPlugin');
      expect(webpackPlugin).toHaveProperty('apply');
    });
  });
});
