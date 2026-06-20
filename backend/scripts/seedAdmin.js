import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../.env') });

// Conexión a DB y Modelo (usaremos pg, ya que Dewatering usa Supabase/PostgreSQL)
// ¡OJO! En este proyecto, userModel usa Supabase (PostgreSQL), no Mongoose.
import userModel from '../src/models/userModel.js';

const seedAdmin = async () => {
  try {
    console.log('🌱 Iniciando Seed del Súper Administrador...');
    
    const adminEmail = 'admin@dewatering.pe';
    
    // Verificar si ya existe
    const existingAdmin = await userModel.findByEmail(adminEmail);
    
    if (existingAdmin) {
      console.log('✅ El Administrador ya existe en la base de datos.');
      console.log(`Email: ${adminEmail}`);
      process.exit(0);
    }

    // Crear la contraseña hasheada
    const password = 'AdminDewatering2024!'; // Contraseña por defecto
    const password_hash = await bcrypt.hash(password, 12);

    // Crear usuario maestro
    const adminData = {
      email: adminEmail,
      password_hash: password_hash,
      full_name: 'Gerencia General',
      phone: '+51 900000000',
      company: 'Dewatering Solutions',
      position: 'Director (Super Admin)',
      role: 'SUPER_ADMIN'
    };

    const newAdmin = await userModel.create(adminData);

    // Activarlo manualmente y darle todos los permisos (en caso usemos is_active)
    // El modelo userModel lo crea por defecto, asegurémonos que esté activo.
    if (newAdmin) {
        console.log('🚀 ¡Súper Administrador creado exitosamente!');
        console.log('--------------------------------------------------');
        console.log(`✉️  Correo:    ${adminEmail}`);
        console.log(`🔑 Contraseña: ${password}`);
        console.log('--------------------------------------------------');
        console.log('Por favor, guarda estos datos y cambia la contraseña en el futuro.');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear el Administrador:', error);
    process.exit(1);
  }
};

seedAdmin();
