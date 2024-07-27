// pages/api/home-content.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"
import { IncomingForm, File, Fields, Files } from 'formidable';
import fs from 'fs/promises';
import path from 'path';

export const config = {
  api: {
    bodyParser: false,
  },
};

async function deleteOldImage(oldImageUrl: string) {
  if (oldImageUrl && oldImageUrl !== '/placeholder.jpg') {
    const oldImagePath = path.join(process.cwd(), 'public', oldImageUrl);
    try {
      await fs.unlink(oldImagePath);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'ancienne image:', error);
    }
  }
}

async function moveFile(oldPath: string, newPath: string) {
  try {
    await fs.copyFile(oldPath, newPath);
    await fs.unlink(oldPath);
  } catch (error) {
    console.error('Erreur lors du déplacement du fichier:', error);
    throw error;
  }
}

let db: Database | null = null;

async function getDb() {
  if (!db) {
    db = await open({
      filename: './mydb.sqlite',
      driver: sqlite3.Database
    });
  }
  return db;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const db = await getDb();

  try {
    if (req.method === 'GET') {
      const content = await db.get('SELECT text, imageUrl FROM home_content LIMIT 1');
      res.status(200).json(content || { text: 'Bienvenue sur notre site !', imageUrl: '/placeholder.jpg' });
    } else if (req.method === 'POST') {
      if (!session) {
        return res.status(401).json({ message: 'Non autorisé' });
      }

      const form = new IncomingForm();
      form.parse(req, async (err, fields: Fields, files: Files) => {
        if (err) {
          return res.status(500).json({ message: 'Erreur lors du traitement du formulaire' });
        }

        const text = Array.isArray(fields.text) ? fields.text[0] : fields.text || '';
        let imageUrl = '/placeholder.jpg';

        // Récupérer l'ancienne image
        const oldContent = await db.get('SELECT imageUrl FROM home_content LIMIT 1');
        const oldImageUrl = oldContent ? oldContent.imageUrl : '/placeholder.jpg';

        if (Array.isArray(files.image) && files.image[0]) {
          const file = files.image[0] as File;
          const fileName = `${Date.now()}_${file.originalFilename}`;
          const newPath = path.join(process.cwd(), 'public', 'uploads', fileName);
          
          try {
            await moveFile(file.filepath, newPath);
            imageUrl = `/uploads/${fileName}`;

            // Supprimer l'ancienne image
            await deleteOldImage(oldImageUrl);
          } catch (error) {
            console.error('Erreur lors du déplacement du fichier:', error);
            return res.status(500).json({ message: 'Erreur lors du traitement de l\'image' });
          }
        } else {
          imageUrl = oldImageUrl;
        }

        await db.run(`
          INSERT OR REPLACE INTO home_content (id, text, imageUrl)
          VALUES (1, ?, ?)
        `, [text, imageUrl]);

        res.status(200).json({ message: 'Contenu mis à jour avec succès', text, imageUrl });
      });
    } else {
      res.status(405).json({ message: 'Méthode non autorisée' });
    }
  } catch (error) {
    console.error('Erreur lors du traitement de la requête:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
}