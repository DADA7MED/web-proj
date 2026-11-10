// server.js — High-performance static & API dev server for Laptop Store
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';
const ROOT_DIR = __dirname;

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

  // Mock API routes for seamless fallback if called
  if (pathname === '/api/get_products.php' || pathname === '/Habiba/Products + Categories + Search & Filters/api/get_products.php') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    try {
      const code = fs.readFileSync(path.join(ROOT_DIR, 'js/data/seedProducts.js'), 'utf8');
      const jsonStr = code.replace(/^[\s\S]*?export const seedProducts =\s*/, '').replace(/;\s*$/, '');
      const data = Function(`"use strict"; return (${jsonStr});`)();
      res.end(JSON.stringify(data));
    } catch (e) {
      res.end('[]');
    }
    return;
  }

  if (pathname === '/api/categoriesApi.php' || pathname === '/Habiba/Products + Categories + Search & Filters/api/categoriesApi.php') {
    res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8' });
    try {
      const code = fs.readFileSync(path.join(ROOT_DIR, 'js/data/seedCategories.js'), 'utf8');
      const jsonStr = code.replace(/^[\s\S]*?export const seedCategories =\s*/, '').replace(/;\s*$/, '');
      const data = Function(`"use strict"; return (${jsonStr});`)();
      res.end(JSON.stringify(data));
    } catch (e) {
      res.end('[]');
    }
    return;
  }

  if (pathname === '/api/wishlist.php' || pathname.includes('wishlist.php')) {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ success: true, status: 'synced', data: [] }));
    return;
  }

  // Rewrite root & friendly URLs
  if (pathname === '/' || pathname === '') {
    pathname = '/index.html';
  } else if (!path.extname(pathname)) {
    if (fs.existsSync(path.join(ROOT_DIR, pathname + '.html'))) {
      pathname = pathname + '.html';
    } else if (fs.existsSync(path.join(ROOT_DIR, pathname, 'index.html'))) {
      pathname = path.join(pathname, 'index.html');
    }
  }

  // Also support .php requests by serving the corresponding .html file if exists
  if (path.extname(pathname) === '.php') {
    const htmlCandidate = pathname.replace(/\.php$/, '.html');
    if (fs.existsSync(path.join(ROOT_DIR, htmlCandidate))) {
      pathname = htmlCandidate;
    }
  }

  const filePath = path.normalize(path.join(ROOT_DIR, pathname));

  // Security: prevent path traversal outside root
  if (!filePath.startsWith(ROOT_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
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

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stats.size,
      'Cache-Control': 'no-cache'
    });

    const stream = fs.createReadStream(filePath);
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
  console.log(` Ready for live browser preview.`);
  console.log(`===============================================`);
});
