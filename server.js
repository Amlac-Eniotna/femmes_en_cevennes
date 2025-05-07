const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const express = require("express");
const path = require("path");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // Configuration cruciale pour servir les fichiers statiques
  server.use(
    "/uploads",
    express.static(path.join(__dirname, "public/uploads")),
  );

  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, "0.0.0.0", (err) => {
    if (err) throw err;
    console.log("> Ready on http://0.0.0.0:3000");
  });
});
