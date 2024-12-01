// scripts/init-db.mjs
import { open } from "sqlite";
import sqlite3 from "sqlite3";

async function initDb() {
  const db = await open({
    filename: "./data/mydb.sqlite",
    driver: sqlite3.Database,
  });

  // Création des tables initiales
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS home_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      text TEXT NOT NULL,
      imageUrl TEXT NOT NULL
    );
  `);

  // Ajout des nouvelles colonnes si elles n'existent pas
  try {
    await db.exec(`
      ALTER TABLE home_content ADD COLUMN fileUrl TEXT;
      ALTER TABLE home_content ADD COLUMN fileName TEXT;
    `);
    console.log("Nouvelles colonnes ajoutées avec succès");
  } catch (error) {
    // Si les colonnes existent déjà, SQLite lancera une erreur
    console.log(
      "Les colonnes existent déjà ou une erreur est survenue:",
      error.message,
    );
  }

  // Insertion des données par défaut si nécessaire
  try {
    await db.exec(`
      INSERT OR IGNORE INTO home_content (id, text, imageUrl, fileUrl, fileName)
      VALUES (1, 'Bienvenue sur notre site !', '/placeholder.jpg', NULL, NULL);
    `);
    console.log("Données par défaut insérées avec succès");
  } catch (error) {
    console.error("Erreur lors de l'insertion des données par défaut:", error);
  }

  console.log("Base de données initialisée avec succès");

  await db.close();
}

initDb().catch(console.error);
