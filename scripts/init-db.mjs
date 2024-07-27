// scripts/init-db.mjs
import sqlite3 from "sqlite3";
import { open } from "sqlite";

async function initDb() {
  const db = await open({
    filename: "./mydb.sqlite",
    driver: sqlite3.Database,
  });

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

    INSERT OR IGNORE INTO home_content (id, text, imageUrl)
    VALUES (1, 'Bienvenue sur notre site !', '/placeholder.jpg');
  `);

  console.log("Base de données initialisée avec succès");

  await db.close();
}

initDb().catch(console.error);
