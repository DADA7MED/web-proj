// const http = require("http");
// const fs = require("fs");
// const path = require("path");

// const root = __dirname;
// const mime = {
//   ".html": "text/html",
//   ".css": "text/css",
//   ".js": "text/javascript",
//   ".jpg": "image/jpeg",
//   ".jpeg": "image/jpeg",
//   ".png": "image/png",
//   ".svg": "image/svg+xml",
//   ".webp": "image/webp",
//   ".ico": "image/x-icon",
// };

// const server = http.createServer((req, res) => {
//   const urlPath = decodeURIComponent(req.url.split("?")[0]);
//   let file = path.join(root, urlPath === "/" ? "index.html" : urlPath);
//   if (!file.startsWith(root)) {
//     res.writeHead(403);
//     res.end("Forbidden");
//     return;
//   }
//   fs.readFile(file, (err, data) => {
//     if (err) {
//       res.writeHead(404);
//       res.end("Not found");
//       return;
//     }
//     res.writeHead(200, { "Content-Type": mime[path.extname(file)] || "application/octet-stream" });
//     res.end(data);
//   });
// });

// server.listen(5500, "127.0.0.1", () => {
//   console.log("Local: http://127.0.0.1:5500");
// });
