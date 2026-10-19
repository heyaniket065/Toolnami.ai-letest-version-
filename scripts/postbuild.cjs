const fs = require("fs");
const path = require("path");

// Generate server.ts for Cloud Run entry point
const serverTsContent = `process.env.HOST = process.env.HOST || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";
import("./.output/server/index.mjs").catch(console.error);
`;
fs.writeFileSync(path.join(__dirname, "..", "server.ts"), serverTsContent);
