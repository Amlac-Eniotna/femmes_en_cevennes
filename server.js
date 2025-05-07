// server.js
const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const path = require("path");
const fs = require("fs");

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Assurer que le répertoire uploads existe
const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) {
  console.log("Création du répertoire uploads:", uploadsDir);
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Assurer que le répertoire data existe pour la base de données SQLite
const dataDir = path.join(process.cwd(), "data");
if (!fs.existsSync(dataDir)) {
  console.log("Création du répertoire data:", dataDir);
  fs.mkdirSync(dataDir, { recursive: true });
}

// Journaliser les détails de configuration
console.log("Démarrage du serveur avec:");
console.log("- Environnement:", process.env.NODE_ENV);
console.log("- Répertoire de travail:", process.cwd());
console.log("- Répertoire uploads:", uploadsDir);
console.log("- Répertoire data:", dataDir);

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    const { pathname } = parsedUrl;

    // Pour déboguer les requêtes de fichiers
    if (pathname.startsWith("/uploads/")) {
      console.log("Requête pour fichier statique:", pathname);
      const filePath = path.join(process.cwd(), "public", pathname);
      console.log("Chemin absolu du fichier:", filePath);

      try {
        if (fs.existsSync(filePath)) {
          console.log("Le fichier existe:", filePath);
          const stat = fs.statSync(filePath);

          if (stat.isFile()) {
            console.log("Envoi du fichier:", filePath);
            const ext = path.extname(filePath).toLowerCase();
            const contentType =
              ext === ".jpg" || ext === ".jpeg"
                ? "image/jpeg"
                : ext === ".png"
                  ? "image/png"
                  : ext === ".pdf"
                    ? "application/pdf"
                    : "application/octet-stream";

            res.writeHead(200, {
              "Content-Type": contentType,
              "Content-Length": stat.size,
              "Cache-Control": "public, max-age=0, must-revalidate",
            });

            const stream = fs.createReadStream(filePath);
            stream.pipe(res);
            return;
          }
        } else {
          console.log("Fichier introuvable:", filePath);
        }
      } catch (error) {
        console.error("Erreur lors de la lecture du fichier:", error);
      }
    }

    // Si ce n'est pas un fichier statique ou si une erreur s'est produite, laisser Next.js gérer la requête
    handle(req, res, parsedUrl);
  }).listen(process.env.PORT || 3000, (err) => {
    if (err) throw err;
    console.log(
      `> Serveur prêt sur http://localhost:${process.env.PORT || 3000}`,
    );
  });
});
