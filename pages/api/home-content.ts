import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open, Database } from "sqlite";
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { IncomingForm, File, Fields, Files } from "formidable";
import fs from "fs/promises";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

// Définir les chemins constants
const UPLOADS_DIR = path.join(process.cwd(), "public", "uploads");

async function ensureUploadsDir() {
  try {
    await fs.access(UPLOADS_DIR);
  } catch {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
  }
}

async function deleteOldImage(oldImageUrl: string) {
  if (oldImageUrl && oldImageUrl !== "/placeholder.jpg") {
    try {
      const fileName = path.basename(oldImageUrl);
      const oldImagePath = path.join(UPLOADS_DIR, fileName);
      await fs.unlink(oldImagePath);
      console.log("Image supprimée:", oldImagePath);
    } catch (error) {
      console.error(
        "Erreur lors de la suppression de l'ancienne image:",
        error,
      );
    }
  }
}

async function moveFile(oldPath: string, newPath: string) {
  try {
    // S'assurer que le dossier uploads existe
    await ensureUploadsDir();

    // Copier le fichier
    await fs.copyFile(oldPath, newPath);
    console.log("Fichier copié vers:", newPath);

    // Supprimer le fichier temporaire
    await fs.unlink(oldPath);
    console.log("Fichier temporaire supprimé:", oldPath);

    // Définir les permissions
    await fs.chmod(newPath, 0o644);
    console.log("Permissions mises à jour pour:", newPath);
  } catch (error) {
    console.error("Erreur détaillée lors du déplacement du fichier:", error);
    throw error;
  }
}

let db: Database | null = null;

async function getDb() {
  if (!db) {
    const dbPath = path.join(process.cwd(), "data", "mydb.sqlite");
    console.log("Chemin de la base de données:", dbPath);

    // Créer le dossier data s'il n'existe pas
    await fs.mkdir(path.dirname(dbPath), { recursive: true });

    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
  }
  return db;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  console.log("Méthode de la requête:", req.method);

  try {
    const session = await getServerSession(req, res, authOptions);
    const db = await getDb();

    if (req.method === "GET") {
      const content = await db.get(
        "SELECT text, imageUrl FROM home_content LIMIT 1",
      );
      return res.status(200).json(
        content || {
          text: "Bienvenue sur notre site !",
          imageUrl: "/placeholder.jpg",
        },
      );
    }

    if (req.method === "POST") {
      if (!session) {
        return res.status(401).json({ message: "Non autorisé" });
      }

      return new Promise((resolve) => {
        const form = new IncomingForm();
        form.parse(req, async (err, fields: Fields, files: Files) => {
          if (err) {
            console.error("Erreur parsing form:", err);
            return resolve(
              res.status(500).json({
                message: "Erreur lors du traitement du formulaire",
                error: err.message,
              }),
            );
          }

          try {
            const text = Array.isArray(fields.text)
              ? fields.text[0]
              : fields.text || "";
            let imageUrl = "/placeholder.jpg";

            const oldContent = await db.get(
              "SELECT imageUrl FROM home_content LIMIT 1",
            );
            const oldImageUrl = oldContent?.imageUrl || "/placeholder.jpg";

            if (Array.isArray(files.image) && files.image[0]) {
              const file = files.image[0] as File;
              const fileName = `${Date.now()}_${file.originalFilename}`;
              const newPath = path.join(UPLOADS_DIR, fileName);

              try {
                await moveFile(file.filepath, newPath);
                imageUrl = `/public/uploads/${fileName}`;
                await deleteOldImage(oldImageUrl);
              } catch (error) {
                console.error("Erreur upload:", error);
                return resolve(
                  res.status(500).json({
                    message: "Erreur lors de l'upload de l'image",
                    error:
                      error instanceof Error
                        ? error.message
                        : "Erreur inconnue",
                  }),
                );
              }
            } else {
              imageUrl = oldImageUrl;
            }

            await db.run(
              `INSERT OR REPLACE INTO home_content (id, text, imageUrl)
               VALUES (1, ?, ?)`,
              [text, imageUrl],
            );

            return resolve(
              res.status(200).json({
                message: "Contenu mis à jour avec succès",
                text,
                imageUrl,
              }),
            );
          } catch (error) {
            console.error("Erreur traitement:", error);
            return resolve(
              res.status(500).json({
                message: "Erreur lors du traitement",
                error:
                  error instanceof Error ? error.message : "Erreur inconnue",
              }),
            );
          }
        });
      });
    }

    return res.status(405).json({ message: "Méthode non autorisée" });
  } catch (error) {
    console.error("Erreur globale:", error);
    return res.status(500).json({
      message: "Erreur interne du serveur",
      error: error instanceof Error ? error.message : "Erreur inconnue",
    });
  }
}
