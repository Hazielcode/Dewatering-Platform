import dotenv from 'dotenv';
dotenv.config();
import pool from './src/config/db.js';

async function addMfaColumns() {
  try {
    console.log('[MFA Setup] 🔧 Verificando columnas en la tabla usuarios...');

    // Añadir mfa_secret
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS mfa_secret VARCHAR(255);
    `);
    console.log('[MFA Setup] ✅ Columna mfa_secret asegurada.');

    // Añadir mfa_enabled
    await pool.query(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS mfa_enabled BOOLEAN DEFAULT FALSE;
    `);
    console.log('[MFA Setup] ✅ Columna mfa_enabled asegurada.');

    console.log('[MFA Setup] 🎉 Base de datos lista para MFA.');
  } catch (error) {
    console.error('[MFA Setup] ❌ Error modificando la base de datos:', error.message);
  } finally {
    await pool.end();
  }
}

addMfaColumns();
