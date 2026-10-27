const fs = require("fs");
const path = require("path");

// 1. Clean and recreate dist with fresh public assets from .output/public
const outputPublic = path.join(__dirname, "..", ".output", "public");
const dist = path.join(__dirname, "..", "dist");
if (fs.existsSync(outputPublic)) {
  fs.rmSync(dist, { recursive: true, force: true });
  fs.mkdirSync(dist, { recursive: true });
  fs.cpSync(outputPublic, dist, { recursive: true });
}

// 2. Ensure dist/index.html exists as a valid HTML fallback
const indexHtmlPath = path.join(dist, "index.html");
if (!fs.existsSync(indexHtmlPath)) {
  const fallbackHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ToolNami — Fast, Free Online Tools</title>
  <meta name="description" content="ToolNami is a clean, fast platform of free online tools for everyday work — PDF, image, text, SEO and developer utilities." />
  <meta name="google-adsense-account" content="ca-pub-7693436223439269" />
  <link rel="icon" href="/favicon.ico" />
</head>
<body>
  <div id="root"></div>
</body>
</html>`;
  fs.writeFileSync(indexHtmlPath, fallbackHtml);
}

// 3. Ensure server.ts is ready for Cloud Run entry point
const serverTsContent = `process.env.HOST = process.env.HOST || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";
process.env.NITRO_HOST = process.env.NITRO_HOST || process.env.HOST;
process.env.NITRO_PORT = process.env.NITRO_PORT || process.env.PORT;
import("./.output/server/index.mjs").catch((err) => {
  console.error("Failed to start production server:", err);
  process.exit(1);
});
`;
fs.writeFileSync(path.join(__dirname, "..", "server.ts"), serverTsContent);
