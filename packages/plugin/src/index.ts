import { Plugin } from 'vite';
import { Compiler, WebpackPluginInstance } from 'webpack';
import { DependencyCycle } from './types';
import fs from 'fs-extra';
import open from 'open';
import path from 'path';
import { fileURLToPath } from 'url';

export interface PluginOptions {
  /**
   * Output directory for the analysis report
   * @default 'dependency-cycle-report'
   */
  outputDir?: string;

  /**
   * Whether to open the report in browser automatically
   * @default true
   */
  open?: boolean;

  /**
   * Port to serve the report on
   * @default 3000
   */
  port?: number;
}

export class DependencyCycleAnalyzerPlugin {
  private options: Required<PluginOptions>;
  private cycles: DependencyCycle[] = [];

  constructor(options: PluginOptions = {}) {
    this.options = {
      outputDir: options.outputDir || 'dependency-cycle-report',
      open: options.open ?? true,
      port: options.port || 3000,
    };
  }

  // Vite plugin implementation
  vite(): Plugin {
    const generateReport = this.generateReport.bind(this);
    return {
      name: 'dependency-cycle-analyzer',
      enforce: 'post',
      async buildEnd() {
        await generateReport();
      },
    };
  }

  // Webpack plugin implementation
  webpack(): WebpackPluginInstance {
    return {
      name: 'DependencyCycleAnalyzerPlugin',
      apply: (compiler: Compiler) => {
        compiler.hooks.done.tap('DependencyCycleAnalyzerPlugin', async () => {
          await this.generateReport();
        });
      },
    };
  }

  private async generateReport() {
    try {
      // Create output directory
      await fs.ensureDir(this.options.outputDir);

      // Copy web app files to output directory
      const webAppDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../../web/dist');
      await fs.copy(webAppDir, this.options.outputDir);

      // Generate cycles data file
      const cyclesData = JSON.stringify(this.cycles, null, 2);
      await fs.writeFile(path.join(this.options.outputDir, 'cycles.json'), cyclesData);

      // Update index.html to include cycles data
      const indexPath = path.join(this.options.outputDir, 'index.html');
      let indexHtml = await fs.readFile(indexPath, 'utf-8');
      indexHtml = indexHtml.replace(
        '</head>',
        `<script>window.CYCLES_DATA = ${cyclesData}</script></head>`
      );
      await fs.writeFile(indexPath, indexHtml);

      // Start server and open browser if requested
      if (this.options.open) {
        const server = require('vite').createServer({
          root: this.options.outputDir,
          server: {
            port: this.options.port,
          },
        });
        await server.listen();
        await open(`http://localhost:${this.options.port}`);
      }

      console.log(`Dependency cycle report generated at ${this.options.outputDir}`);
    } catch (error) {
      console.error('Failed to generate dependency cycle report:', error);
    }
  }

  // Method to add cycles from ESLint output
  public addCyclesFromESLint(output: string) {
    const lines = output.split('\n');
    let currentCycle: DependencyCycle | null = null;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.includes('Dependency cycle detected')) {
        const fileMatch = line.match(/at (.+?):(\d+):(\d+)/);
        if (fileMatch) {
          const [, file, lineNum, column] = fileMatch;
          currentCycle = {
            file,
            line: parseInt(lineNum),
            column: parseInt(column),
            cyclePath: [],
            codeContext: '',
          };
        }
      } else if (currentCycle && line.trim()) {
        const importMatch = line.match(/import .+ from ['"](.+?)['"]/);
        if (importMatch) {
          const importPath = importMatch[1];
          currentCycle.cyclePath.push(importPath);
        }
        currentCycle.codeContext += line + '\n';
      } else if (currentCycle && !line.trim()) {
        if (currentCycle.cyclePath.length > 0) {
          this.cycles.push(currentCycle);
        }
        currentCycle = null;
      }
    }

    if (currentCycle && currentCycle.cyclePath.length > 0) {
      this.cycles.push(currentCycle);
    }
  }
}

export default DependencyCycleAnalyzerPlugin;
