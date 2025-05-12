const fs = require("fs");
const path = require("path");

const pkg = require("../package.json");

// Create minimal package.json for dist
const minimal = {
  name: pkg.name,
  version: pkg.version,
  description: pkg.description,
  main: pkg.main,
  module: pkg.module,
  types: pkg.types,
  exports: pkg.exports,
  sideEffects: pkg.sideEffects,
  keywords: pkg.keywords,
  author: pkg.author,
  license: pkg.license,
  repository: pkg.repository,
  bugs: pkg.bugs,
  homepage: pkg.homepage,
  publishConfig: pkg.publishConfig,
  peerDependencies: pkg.peerDependencies,
};

// Write minimal package.json to dist
fs.writeFileSync(
  path.join(__dirname, "../dist/package.json"),
  JSON.stringify(minimal, null, 2)
);

// Function to safely copy files
function safeCopyFile(source, destination) {
  try {
    if (fs.existsSync(source)) {
      fs.copyFileSync(source, destination);
      console.log(`✓ Copied ${path.basename(source)} to dist/`);
    } else {
      console.warn(`⚠️ Warning: ${path.basename(source)} not found`);
    }
  } catch (error) {
    console.error(`✗ Error copying ${path.basename(source)}:`, error.message);
  }
}

// Copy README.md and LICENSE to dist
safeCopyFile(
  path.join(__dirname, "../README.md"),
  path.join(__dirname, "../dist/README.md")
);

safeCopyFile(
  path.join(__dirname, "../LICENSE"),
  path.join(__dirname, "../dist/LICENSE")
);
