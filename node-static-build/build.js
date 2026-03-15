const fs = require("fs");
const path = require("path");

const distDir = path.join(__dirname, "dist");
if (!fs.existsSync(distDir)) fs.mkdirSync(distDir);

const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>node-static-build</title>
  <style>
    body { font-family: system-ui, sans-serif; max-width: 600px; margin: 4rem auto; padding: 0 1rem; }
    code { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }
  </style>
</head>
<body>
  <h1>node-static-build</h1>
  <p>This page was generated at build time: <code>${new Date().toISOString()}</code></p>
  <p>Served by Express from the <code>dist/</code> directory.</p>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, "index.html"), html);
console.log("Build complete: dist/index.html");
