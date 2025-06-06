import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from "path";

let db: any = null;

async function getDb() {
  if (!db) {
    db = await open({
      filename: path.join(process.cwd(), "data", "mydb.sqlite"),
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  return db.get("SELECT * FROM users WHERE email = ?", [email]);
}
