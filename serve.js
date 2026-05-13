const http = require("http");
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname);
const port = Number(process.env.PORT) || 3080;

const mime = {
  ".html": "text/html; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".ico": "image/x-icon",
};

function safePath(urlPath) {
  const rel = decodeURIComponent((urlPath || "/").split("?")[0] || "/");
  const normalized = rel === "/" ? "index.html" : rel.replace(/^\//, "");
  const full = path.resolve(root, normalized);
  if (!full.startsWith(root + path.sep) && full !== root) {
    return null;
  }
  return full;
}

http
  .createServer((req, res) => {
    const fp = safePath(req.url || "/");
    if (!fp) {
      res.writeHead(403);
      res.end();
      return;
    }
    fs.readFile(fp, (err, data) => {
      if (err) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      const ext = path.extname(fp).toLowerCase();
      res.writeHead(200, { "Content-Type": mime[ext] || "application/octet-stream" });
      res.end(data);
    });
  })
  .listen(port, "127.0.0.1", () => {
    process.stdout.write(`http://127.0.0.1:${port}/\n`);
  });
