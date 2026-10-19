import fs from 'node:fs';
import path from 'node:path';
const root = process.cwd();
if (process.stdin.isTTY) process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
console.log('Project writer ready.');
let buffer = '';
process.stdin.on('data', chunk => {
  buffer += chunk.replaceAll('\r', '\n');
  let end;
  while ((end = buffer.indexOf('\n')) >= 0) {
    const line = buffer.slice(0, end); buffer = buffer.slice(end + 1);
    if (!line.trim()) continue;
    try {
      const data = JSON.parse(line);
      if (data.done) process.exit(0);
      for (const [name, content] of Object.entries(data.files || {})) {
        const dest = path.resolve(root, name);
        const relative = path.relative(root, dest);
        if (!relative || relative.startsWith('..') || path.isAbsolute(relative) || relative.startsWith('node_modules')) throw new Error('Path outside project');
        fs.mkdirSync(path.dirname(dest), { recursive: true });
        fs.writeFileSync(dest, content, 'utf8');
        console.log('Saved ' + name);
      }
    } catch (error) { console.error(error.message); }
  }
});
