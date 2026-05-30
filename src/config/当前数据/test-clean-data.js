const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');

const scriptPath = path.join(__dirname, 'clean-data.js');
const tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clean-data-'));
const inputPath = path.join(tempDir, 'data.json');

fs.writeFileSync(
  inputPath,
  JSON.stringify(
    [
      { id: 1, name: '品牌A', location: '一楼 A101', phone: '123' },
      { id: 2, name: '品牌B', location: '一楼 A101', description: 'discard me' },
      { id: 3, name: '品牌C', location: '二楼/B202', avatar_url: 'discard me' },
    ],
    null,
    2,
  ),
);

execFileSync(process.execPath, [scriptPath, inputPath], { stdio: 'pipe' });

const output = JSON.parse(fs.readFileSync(path.join(tempDir, 'data.cleaned.json'), 'utf8'));

assert.deepStrictEqual(output, [
  { id: 1, name: '品牌A', location: '一楼 A101' },
  { id: 2, name: '品牌B', location: '一楼 A101' },
  { id: 3, name: '品牌C', location: '二楼/B202' },
]);

for (const item of output) {
  assert.deepStrictEqual(Object.keys(item), ['id', 'name', 'location']);
}

fs.rmSync(tempDir, { recursive: true, force: true });
