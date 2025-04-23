import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the coverage reports
const webCoverage = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../coverage/web-coverage.json'), 'utf8')
);
const pluginCoverage = JSON.parse(
  fs.readFileSync(path.join(__dirname, '../coverage/plugin-coverage.json'), 'utf8')
);

// Combine the coverage data
const combinedCoverage = {
  ...webCoverage,
  ...pluginCoverage,
};

// Write the combined coverage report
fs.writeFileSync(
  path.join(__dirname, '../coverage/combined-coverage.json'),
  JSON.stringify(combinedCoverage, null, 2)
);

console.log('Coverage reports combined successfully!');
