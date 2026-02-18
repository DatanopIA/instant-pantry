import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __dirname = dirname(fileURLToPath(import.meta.url));
// En Vercel, el sistema de archivos es de solo lectura excepto /tmp
const dbPath = process.env.VERCEL ? join('/tmp', 'pantry.db') : join(__dirname, 'pantry.db');

// Si estamos en Vercel, copiamos la DB inicial si no existe en /tmp
if (process.env.VERCEL && !fs.existsSync(dbPath)) {
    const sourcePath = join(__dirname, 'pantry.db');
    if (fs.existsSync(sourcePath)) {
        fs.copyFileSync(sourcePath, dbPath);
    }
}

const db = new Database(dbPath);

// Inicializar tablas (siempre por seguridad)
db.exec(`
  CREATE TABLE IF NOT EXISTS inventory (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    exp INTEGER NOT NULL,
    icon TEXT,
    status TEXT DEFAULT 'green'
  );

  CREATE TABLE IF NOT EXISTS recipes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    time TEXT,
    cal TEXT,
    tags TEXT,
    img TEXT,
    desc TEXT,
    ingredients TEXT,
    steps TEXT,
    is_favorite INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL,
    sender TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

export default db;
