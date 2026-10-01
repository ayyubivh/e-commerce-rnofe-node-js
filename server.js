require("dotenv").config();
const app = require("./src/app");
const initDb = require("./src/db/init");

const PORT = process.env.PORT || 3000;

async function start() {
  await initDb();

  const server = app.listen(PORT, () => {
    console.log(`ecommerce-api listening on http://localhost:${PORT}`);
  });

  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(`Port ${PORT} is already in use. Stop the other process or set PORT to a different value in .env.`);
      process.exit(1);
    }
    throw err;
  });
}

start().catch((err) => {
  console.error("Failed to start:", err.message);
  process.exit(1);
});
