import fs from "fs/promises";
import path from "path";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function cleanupImages() {
  const db = await open({
    filename: "./mydb.sqlite",
    driver: sqlite3.Database,
  });

  // Récupérer l'URL de l'image actuellement utilisée
  const content = await db.get("SELECT imageUrl FROM home_content LIMIT 1");
  const currentImageUrl = content ? content.imageUrl : "/placeholder.jpg";

  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  try {
    const files = await fs.readdir(uploadsDir);

    for (const file of files) {
      const filePath = path.join(uploadsDir, file);
      const fileUrl = `/uploads/${file}`;

      // Si le fichier n'est pas l'image actuelle, le supprimer
      if (fileUrl !== currentImageUrl) {
        await fs.unlink(filePath);
        console.log(`Image supprimée : ${file}`);
      }
    }

    console.log("Nettoyage des images terminé");
  } catch (error) {
    console.error("Erreur lors du nettoyage des images:", error);
  }

  await db.close();
}

cleanupImages().catch(console.error);
