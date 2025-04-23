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

// Create the combined coverage object by merging the coverage data
const combinedCoverage = {
  ...webCoverage,
  ...pluginCoverage,
};

// Write the combined coverage report
fs.writeFileSync(outputPath, JSON.stringify(combinedCoverage, null, 2));

console.log('Coverage reports combined successfully!');
