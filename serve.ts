// A tiny static server for looking at the site while building it.
// Serves app/ at http://localhost:8080 (or --port <n>). Not part of the entry.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(fileURLToPath(new URL(".", import.meta.url)), "app");
const port = Number(process.argv[process.argv.indexOf("--port") + 1] || 8080);
const types = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json" };

createServer(async (req, res) => {
  const path = normalize(join(root, decodeURIComponent(req.url.split("?")[0]))).replace(/\/$/, "/index.html");
  if (!path.startsWith(root)) { res.writeHead(403); res.end(); return; }
  try {
    const body = await readFile(path === root ? join(root, "index.html") : path);
    res.writeHead(200, { "content-type": types[extname(path)] || "application/octet-stream" });
    res.end(body);
  } catch {
    res.writeHead(404); res.end("not found");
  }
}).listen(port, () => console.log(`Hearth Ledger at http://localhost:${port}`));
