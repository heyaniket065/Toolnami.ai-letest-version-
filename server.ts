process.env.HOST = process.env.HOST || "0.0.0.0";
process.env.PORT = process.env.PORT || "3000";
process.env.NITRO_HOST = process.env.NITRO_HOST || process.env.HOST;
process.env.NITRO_PORT = process.env.NITRO_PORT || process.env.PORT;
import("./.output/server/index.mjs").catch((err) => {
  console.error("Failed to start production server:", err);
  process.exit(1);
});
