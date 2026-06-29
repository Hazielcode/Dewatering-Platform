import dotenv from 'dotenv';
dotenv.config();
import pool from './src/config/db.js';

async function resetMfa() {
  try {
    console.log('🔄 Reseteando estado MFA de todos los usuarios para limpieza...');
    
    await pool.query(`
      UPDATE users 
      SET mfa_enabled = false, mfa_secret = null;
    `);
    
    console.log('✅ ¡Todos los usuarios han sido reseteados! El MFA está desactivado para todos.');
  } catch (error) {
    console.error('❌ Error reseteando MFA:', error.message);
  } finally {
    await pool.end();
  }
}

resetMfa();
