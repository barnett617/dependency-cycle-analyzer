import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const webCoveragePath = path.join(__dirname, '../coverage/web-coverage.json');
const pluginCoveragePath = path.join(__dirname, '../coverage/plugin-coverage.json');
const outputPath = path.join(__dirname, '../coverage/coverage-final.json');

// Read the coverage reports
const webCoverage = JSON.parse(fs.readFileSync(webCoveragePath, 'utf8'));
const pluginCoverage = JSON.parse(fs.readFileSync(pluginCoveragePath, 'utf8'));

// Create the combined coverage object
const combinedCoverage = {
  type: 'coverage-final.json',
  data: {
    coverage: {
      ...webCoverage.data.coverage,
      ...pluginCoverage.data.coverage,
    },
  },
};

// Write the combined coverage report
fs.writeFileSync(outputPath, JSON.stringify(combinedCoverage, null, 2));

console.log('Coverage reports combined successfully!');
