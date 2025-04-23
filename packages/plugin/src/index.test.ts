import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DependencyCycleAnalyzerPlugin } from './index';
import fs from 'fs-extra';
import open from 'open';
import { createServer } from 'vite';

// Mock dependencies
vi.mock('fs-extra', () => ({
  ensureDir: vi.fn(),
  copy: vi.fn(),
  writeFile: vi.fn(),
  readFile: vi.fn(),
}));
vi.mock('open');
vi.mock('vite', () => ({
  createServer: vi.fn().mockImplementation(async () => ({
    listen: vi.fn().mockResolvedValue(undefined),
  })),
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
      expect(defaultPlugin['options']).toEqual({
        outputDir: 'dependency-cycle-report',
        open: true,
        port: 3000,
      });
    });

    it('accepts custom options', () => {
      const customPlugin = new DependencyCycleAnalyzerPlugin({
        outputDir: 'custom-dir',
        open: false,
        port: 4000,
      });
      expect(customPlugin['options']).toEqual({
        outputDir: 'custom-dir',
        open: false,
        port: 4000,
      });
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

    it('handles output without valid cycles', () => {
      plugin.addCyclesFromESLint('Some random text\nwithout cycles');
      expect(plugin['cycles']).toHaveLength(0);
    });
  });

  describe('generateReport', () => {
    it('generates report and opens browser when open is true', async () => {
      // Mock fs-extra methods
      vi.mocked(fs.ensureDir).mockResolvedValue();
      vi.mocked(fs.copy).mockResolvedValue();
      vi.mocked(fs.writeFile).mockResolvedValue();
      vi.mocked(fs.readFile).mockResolvedValue('<html><head></head></html>' as any);

      // Add some test cycles
      plugin.addCyclesFromESLint(`
Dependency cycle detected at /path/to/file.ts:1:1
import { foo } from './bar';
import { bar } from './baz';
`);

      // Call generateReport through the Vite plugin
      const vitePlugin = plugin.vite();
      const buildEnd = vitePlugin.buildEnd as (() => Promise<void>) | undefined;
      if (buildEnd) {
        await buildEnd();
      }

      // Verify the report generation
      expect(fs.ensureDir).toHaveBeenCalledWith('dependency-cycle-report');
      expect(fs.copy).toHaveBeenCalled();
      expect(fs.writeFile).toHaveBeenCalledTimes(2);
      expect(createServer).toHaveBeenCalledWith({
        root: 'dependency-cycle-report',
        server: {
          port: 3000,
        },
      });
      expect(open).toHaveBeenCalledWith('http://localhost:3000');
    });

    it('handles errors during report generation', async () => {
      // Mock fs-extra to throw an error
      vi.mocked(fs.ensureDir).mockRejectedValue(new Error('Test error'));

      // Spy on console.error
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

      // Call generateReport through the Vite plugin
      const vitePlugin = plugin.vite();
      const buildEnd = vitePlugin.buildEnd as (() => Promise<void>) | undefined;
      if (buildEnd) {
        await buildEnd();
      }

      // Verify error handling
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to generate dependency cycle report:',
        expect.any(Error)
      );
    });
  });

  describe('vite plugin', () => {
    it('returns a valid Vite plugin', () => {
      const vitePlugin = plugin.vite();
      expect(vitePlugin).toHaveProperty('name', 'dependency-cycle-analyzer');
      expect(vitePlugin).toHaveProperty('enforce', 'post');
      expect(vitePlugin.buildEnd).toBeDefined();
    });
  });

  describe('webpack plugin', () => {
    it('returns a valid Webpack plugin', () => {
      const webpackPlugin = plugin.webpack();
      expect(webpackPlugin).toHaveProperty('name', 'DependencyCycleAnalyzerPlugin');
      expect(webpackPlugin.apply).toBeDefined();
    });
  });
});
