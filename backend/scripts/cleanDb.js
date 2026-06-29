import { query } from '../src/config/db.js';
import bcrypt from 'bcrypt';

const cleanDb = async () => {
  try {
    console.log('🧹 Limpiando la base de datos para pruebas...');

    // Limpiar Auditoría
    await query('TRUNCATE TABLE audit_logs CASCADE;');
    console.log('✅ Tabla audit_logs limpiada.');

    // Opcional: Limpiar productos y sucursales (si existen)
    try {
      await query('TRUNCATE TABLE products CASCADE;');
      console.log('✅ Tabla products limpiada.');
    } catch (e) {}
    try {
      await query('TRUNCATE TABLE stores CASCADE;');
      console.log('✅ Tabla stores limpiada.');
    } catch (e) {}

    // Limpiar usuarios, pero preservar roles si existen
    await query('TRUNCATE TABLE users CASCADE;');
    console.log('✅ Tabla users limpiada.');

    // Recrear el Súper Administrador
    console.log('🌱 Recreando el Súper Administrador...');
    const adminEmail = 'admin@dewatering.pe';
    const password = 'AdminDewatering2024!';
    const password_hash = await bcrypt.hash(password, 12);

    const insertQuery = `
      INSERT INTO users (
        email, password_hash, full_name, phone, company, position, role, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, true) RETURNING id
    `;
    const values = [
      adminEmail,
      password_hash,
      'Gerencia General',
      '+51 900000000',
      'Dewatering Solutions',
      'Director (Super Admin)',
      'SUPER_ADMIN'
    ];

    await query(insertQuery, values);
    
    console.log('🚀 Base de datos completamente limpia y lista.');
    console.log('--------------------------------------------------');
    console.log(`✉️  Correo Admin:    ${adminEmail}`);
    console.log(`🔑 Contraseña:      ${password}`);
    console.log('--------------------------------------------------');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al limpiar la base de datos:', error);
    process.exit(1);
  }
};

cleanDb();
