import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { query } from '../src/config/db.js';

const alterAvatarColumn = async () => {
  try {
    console.log('🔄 Ejecutando migración: Cambiando avatar_url a TEXT...');
    
    const alterSql = `ALTER TABLE users ALTER COLUMN avatar_url TYPE TEXT;`;
    await query(alterSql);
    console.log('✅ Columna avatar_url modificada a TEXT exitosamente.');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar la migración:', error);
    process.exit(1);
  }
};

alterAvatarColumn();
