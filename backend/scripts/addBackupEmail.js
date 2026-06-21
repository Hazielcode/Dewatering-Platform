import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

import { query } from '../src/config/db.js';

const addBackupEmailColumn = async () => {
  try {
    console.log('🔄 Ejecutando migración: Agregando columna backup_email a users...');
    
    // Check if column exists first
    const checkSql = `
      SELECT column_name 
      FROM information_schema.columns 
      WHERE table_name='users' and column_name='backup_email';
    `;
    const checkResult = await query(checkSql);
    
    if (checkResult.rows.length > 0) {
      console.log('✅ La columna backup_email ya existe.');
    } else {
      const alterSql = `ALTER TABLE users ADD COLUMN backup_email VARCHAR(255);`;
      await query(alterSql);
      console.log('✅ Columna backup_email agregada exitosamente.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al ejecutar la migración:', error);
    process.exit(1);
  }
};

addBackupEmailColumn();
