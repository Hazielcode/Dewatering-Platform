import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './src/config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigration() {
  try {
    console.log('[Dewatering] ⏳ Leyendo esquema SQL...');
    const sqlFilePath = path.join(__dirname, '../database/database.sql');
    const sql = fs.readFileSync(sqlFilePath, 'utf8');

    console.log('[Dewatering] 🚀 Ejecutando esquema en Supabase...');
    await pool.query(sql);

    console.log('[Dewatering] ✅ ¡Tablas y datos iniciales creados exitosamente!');
  } catch (error) {
    console.error('[Dewatering] ❌ Error al ejecutar el SQL:', error.message);
  } finally {
    await pool.end();
  }
}

runMigration();
