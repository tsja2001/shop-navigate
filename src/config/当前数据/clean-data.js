#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const inputPath = path.resolve(process.argv[2] || path.join(__dirname, 'data.json'));
const parsedPath = path.parse(inputPath);
const outputPath = process.argv[3]
  ? path.resolve(process.argv[3])
  : path.join(parsedPath.dir, `${parsedPath.name}.cleaned${parsedPath.ext}`);

const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));

if (!Array.isArray(data)) {
  throw new Error('Input JSON must be an array.');
}

const cleaned = data.map((item) => ({
  id: item.id,
  name: item.name,
  location: item.location,
}));

fs.writeFileSync(outputPath, `${JSON.stringify(cleaned, null, 2)}\n`);

console.log(`Wrote ${cleaned.length} item(s) to ${outputPath}`);
