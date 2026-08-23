const http = require('http');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const port = Number(process.env.CANVAR_PORT) || 8000;
const mimeTypes = {
  '.css': 'text/css; charset=utf-8',
  '.glb': 'model/gltf-binary',
  '.gif': 'image/gif',
  '.html': 'text/html; charset=utf-8',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
};

const server = http.createServer((request, response) => {
  let pathname;

  try {
    pathname = decodeURIComponent(new URL(request.url, `http://${request.headers.host || 'localhost'}`).pathname);
  } catch {
    response.writeHead(400).end('Bad request');
    return;
  }

  let filePath = path.resolve(root, `.${pathname}`);
  if (filePath !== root && !filePath.startsWith(root + path.sep)) {
    response.writeHead(403).end('Forbidden');
    return;
  }

  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, 'index.html');
  }

  if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
    response.writeHead(404).end('Not found');
    return;
  }

  response.writeHead(200, {
    'Cache-Control': 'no-store',
    'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
  });
  fs.createReadStream(filePath).pipe(response);
});

server.listen(port, '127.0.0.1', () => {
  process.stdout.write(`CANVAR local server: http://127.0.0.1:${port}\n`);
});
