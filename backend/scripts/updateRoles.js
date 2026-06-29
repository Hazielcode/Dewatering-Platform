import { query } from '../src/config/db.js';

const updateRoles = async () => {
  try {
    console.log('🔄 Actualizando perfiles en la base de datos a solo 3 perfiles principales...');

    try { 
      await query('TRUNCATE TABLE roles CASCADE;'); 
      await query(`
        INSERT INTO roles (nombre) VALUES 
        ('ADMIN'),
        ('OPERATOR'),
        ('CLIENT')
      `);
    } catch (e) {
      console.log('Nota: La tabla roles no existe o tiene otra estructura. Procediendo con users.');
    }

    // Actualizar el rol en la tabla usuarios si es necesario
    await query(`UPDATE users SET role = 'OPERATOR' WHERE role NOT IN ('SUPER_ADMIN', 'ADMIN', 'CLIENT')`);
    
    console.log('✅ Perfiles actualizados correctamente. Ahora solo existen: SUPER_ADMIN/ADMIN, OPERATOR y CLIENT.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al actualizar roles:', error);
    process.exit(1);
  }
};

updateRoles();
