const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const destDir = path.join(__dirname, '..', '..', 'build');

if (!fs.existsSync(buildDir)) {
  console.error(`No build output found at ${buildDir} - run "npm run build" first.`);
  process.exit(1);
}

fs.rmSync(destDir, { recursive: true, force: true });
fs.cpSync(buildDir, destDir, { recursive: true });
console.log(`Replaced ${destDir} with fresh build output from ${buildDir}.`);
