// server.js — High-performance static & API dev server for Laptop Store
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const ROOT_DIR = __dirname;
const FRONTEND_DIR = path.join(ROOT_DIR, 'frontend');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
  // CORS & headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const parsedUrl = url.parse(req.url, true);
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Mock API routes for seamless fallback
  if (pathname === '/api/get_products.php' || pathname.endsWith('get_products.php')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    try {
      const code = fs.readFileSync(path.join(FRONTEND_DIR, 'js/data/seedProducts.js'), 'utf8');
      const jsonStr = code.replace(/^[\s\S]*?export const seedProducts =\s*/, '').replace(/;\s*$/, '');
      const data = Function(`"use strict"; return (${jsonStr});`)();
      res.end(JSON.stringify(data));
    } catch (e) {
      res.end('[]');
    }
    return;
  }

  if (pathname === '/api/categoriesApi.php' || pathname.endsWith('categoriesApi.php')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    try {
      const code = fs.readFileSync(path.join(FRONTEND_DIR, 'js/data/seedCategories.js'), 'utf8');
      const jsonStr = code.replace(/^[\s\S]*?export const seedCategories =\s*/, '').replace(/;\s*$/, '');
      const data = Function(`"use strict"; return (${jsonStr});`)();
      res.end(JSON.stringify(data));
    } catch (e) {
      res.end('[]');
    }
    return;
  }

  if (pathname === '/api/wishlist.php' || pathname.endsWith('wishlist.php')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, status: 'synced', data: [] }));
    return;
  }

  if (pathname === '/api/orders.php' || pathname.endsWith('orders.php')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, status: 'ok', orders: [] }));
    return;
  }

  if (pathname === '/api/auth.php' || pathname.endsWith('auth.php')) {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ success: true, status: 'authenticated' }));
    return;
  }

  // Rewrite root
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  }

  // Determine file location: check frontend/ first, then ROOT_DIR
  let candidatePaths = [];

  // If path starts with /frontend/, strip or check directly
  if (pathname.startsWith('/frontend/')) {
    candidatePaths.push(path.normalize(path.join(ROOT_DIR, pathname)));
  } else {
    candidatePaths.push(path.normalize(path.join(FRONTEND_DIR, pathname)));
    candidatePaths.push(path.normalize(path.join(ROOT_DIR, pathname)));
  }

  // Also try with .html extension if extension is missing
  if (!path.extname(pathname)) {
    candidatePaths.unshift(path.normalize(path.join(FRONTEND_DIR, pathname + '.html')));
  }

  let finalFilePath = null;
  for (const p of candidatePaths) {
    if (p.startsWith(ROOT_DIR) && fs.existsSync(p)) {
      try {
        const s = fs.statSync(p);
        if (s.isFile()) {
          finalFilePath = p;
          break;
        } else if (s.isDirectory() && fs.existsSync(path.join(p, 'index.html'))) {
          finalFilePath = path.join(p, 'index.html');
          break;
        }
      } catch (e) {}
    }
  }

  if (!finalFilePath) {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 Not Found</title><style>body{font-family:sans-serif;background:#0f172a;color:#fff;text-align:center;padding:50px;}</style></head>
      <body>
        <h2>404 — Page Not Found</h2>
        <p>Requested URL <code>${escapeHtml(pathname)}</code> does not exist.</p>
        <p><a href="/" style="color:#38bdf8;">Return to Home Storefront</a></p>
      </body>
      </html>
    `);
    return;
  }

  const ext = path.extname(finalFilePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.stat(finalFilePath, (err, stats) => {
    if (err) {
      res.writeHead(500);
      res.end('500 Server Error');
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(finalFilePath);
    stream.pipe(res);
  });
});

function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[ch]));
}

server.listen(PORT, HOST, () => {
  console.log(`===============================================`);
  console.log(` Laptop Store dev server running on:`);
  console.log(` http://${HOST}:${PORT}`);
  console.log(` Serving frontend/ and backend/ seamlessly`);
  console.log(` Ready for live browser preview.`);
  console.log(`===============================================`);
});
