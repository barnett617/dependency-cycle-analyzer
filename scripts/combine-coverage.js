import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webCoveragePath = path.join(__dirname, '../packages/web/coverage/coverage-final.json');
const pluginCoveragePath = path.join(__dirname, '../packages/plugin/coverage/coverage-final.json');
const outputPath = path.join(__dirname, '../coverage/coverage-final.json');

// Ensure output directory exists
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// Read the coverage reports
const webCoverage = JSON.parse(fs.readFileSync(webCoveragePath, 'utf8'));
const pluginCoverage = JSON.parse(fs.readFileSync(pluginCoveragePath, 'utf8'));

// Create the combined coverage object
const combinedCoverage = {};

// Helper function to merge coverage data
function mergeCoverageData(target, source) {
  for (const [filePath, coverage] of Object.entries(source)) {
    if (!target[filePath]) {
      target[filePath] = coverage;
    } else {
      // Merge statementMap
      target[filePath].statementMap = {
        ...target[filePath].statementMap,
        ...coverage.statementMap,
      };

      // Merge branchMap
      target[filePath].branchMap = {
        ...target[filePath].branchMap,
        ...coverage.branchMap,
      };

      // Merge fnMap
      target[filePath].fnMap = {
        ...target[filePath].fnMap,
        ...coverage.fnMap,
      };

      // Merge s, b, and f arrays
      target[filePath].s = [...(target[filePath].s || []), ...(coverage.s || [])];
      target[filePath].b = [...(target[filePath].b || []), ...(coverage.b || [])];
      target[filePath].f = [...(target[filePath].f || []), ...(coverage.f || [])];

      // Update all flag
      target[filePath].all = target[filePath].all && coverage.all;
    }
  }
}

// Merge coverage data
mergeCoverageData(combinedCoverage, webCoverage);
mergeCoverageData(combinedCoverage, pluginCoverage);

// Write the combined coverage report
fs.writeFileSync(outputPath, JSON.stringify(combinedCoverage, null, 2));

console.log('Coverage reports combined successfully!');
