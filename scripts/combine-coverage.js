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

// Create a new coverage object
const combinedCoverage = {};

// Helper function to process coverage data
function processCoverageData(coverage) {
  for (const [filePath, data] of Object.entries(coverage)) {
    if (!combinedCoverage[filePath]) {
      combinedCoverage[filePath] = {
        path: data.path,
        statementMap: {},
        fnMap: {},
        branchMap: {},
        s: [],
        f: [],
        b: [],
        all: true,
      };
    }

    // Process statementMap
    if (data.statementMap) {
      Object.entries(data.statementMap).forEach(([key, value]) => {
        combinedCoverage[filePath].statementMap[key] = value;
      });
    }

    // Process fnMap
    if (data.fnMap) {
      Object.entries(data.fnMap).forEach(([key, value]) => {
        combinedCoverage[filePath].fnMap[key] = value;
      });
    }

    // Process branchMap
    if (data.branchMap) {
      Object.entries(data.branchMap).forEach(([key, value]) => {
        combinedCoverage[filePath].branchMap[key] = value;
      });
    }

    // Process coverage arrays
    if (Array.isArray(data.s)) {
      combinedCoverage[filePath].s = [...combinedCoverage[filePath].s, ...data.s];
    }
    if (Array.isArray(data.f)) {
      combinedCoverage[filePath].f = [...combinedCoverage[filePath].f, ...data.f];
    }
    if (Array.isArray(data.b)) {
      combinedCoverage[filePath].b = [...combinedCoverage[filePath].b, ...data.b];
    }

    // Update all flag
    combinedCoverage[filePath].all = combinedCoverage[filePath].all && (data.all || false);
  }
}

// Process both coverage reports
processCoverageData(webCoverage);
processCoverageData(pluginCoverage);

// Write the combined coverage report
fs.writeFileSync(outputPath, JSON.stringify(combinedCoverage, null, 2));

console.log('Coverage reports combined successfully!');
