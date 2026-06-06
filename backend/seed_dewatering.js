import pool from './src/config/db.js';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

async function seed() {
  const client = await pool.connect();
  try {
    console.log('[Dewatering] 🌱 Iniciando seed de datos demo...\n');

    // ==================== 1. USUARIOS ====================
    const adminHash = await bcrypt.hash('Admin@2026', 12);
    const commercialHash = await bcrypt.hash('Sales@2026', 12);
    const engineerHash = await bcrypt.hash('Eng@2026!', 12);
    const clientHash = await bcrypt.hash('Client@2026', 12);

    const users = await client.query(`
      INSERT INTO users (email, password_hash, full_name, phone, company, position, role) VALUES
        ('admin@dewatering.com', $1, 'Carlos Mendoza', '+51 999 111 001', 'Dewatering Solutions', 'Gerente General', 'SUPER_ADMIN'),
        ('ventas@dewatering.com', $2, 'María Flores', '+51 999 111 002', 'Dewatering Solutions', 'Ejecutiva Comercial', 'COMMERCIAL'),
        ('ingenieria@dewatering.com', $3, 'Jorge Ramírez', '+51 999 111 003', 'Dewatering Solutions', 'Ingeniero de Procesos', 'ENGINEER'),
        ('contacto@minera-andina.com', $4, 'Ana Torres', '+51 999 222 001', 'Minera Andina SAC', 'Jefe de Operaciones', 'CLIENT')
      ON CONFLICT (email) DO NOTHING
      RETURNING id, email, role;
    `, [adminHash, commercialHash, engineerHash, clientHash]);
    console.log(`  ✅ ${users.rowCount} usuarios creados`);

    // ==================== 2. CATEGORÍAS DE SERVICIO ====================
    await client.query(`
      INSERT INTO service_categories (name, slug, description, icon, sort_order) VALUES
        ('Filtración', 'filtracion', 'Ensayos y procesos de filtración industrial para separación sólido-líquido', 'Filter', 1),
        ('Espesamiento', 'espesamiento', 'Procesos de espesamiento para concentración de pulpas y relaves', 'Layers', 2),
        ('Flotación', 'flotacion', 'Ensayos de flotación para recuperación de minerales valiosos', 'Waves', 3),
        ('Lixiviación', 'lixiviacion', 'Procesos de lixiviación para extracción de metales', 'Droplets', 4),
        ('Pilotaje', 'pilotaje', 'Pruebas piloto a escala semi-industrial en campo', 'FlaskConical', 5),
        ('Montaje', 'montaje', 'Instalación y montaje de equipos industriales', 'Wrench', 6)
      ON CONFLICT (slug) DO NOTHING;
    `);
    console.log('  ✅ 6 categorías de servicio creadas');

    // ==================== 3. SERVICIOS ====================
    await client.query(`
      INSERT INTO services (category_id, name, slug, short_description, is_featured, sort_order) VALUES
        (1, 'Ensayo de Filtración al Vacío', 'ensayo-filtracion-vacio', 'Determinación de parámetros de filtración con equipo de vacío a escala laboratorio', true, 1),
        (1, 'Ensayo de Filtración a Presión', 'ensayo-filtracion-presion', 'Pruebas con filtro prensa a escala banco para determinar ciclos óptimos', true, 2),
        (1, 'Selección de Telas Filtrantes', 'seleccion-telas', 'Evaluación y selección de medios filtrantes para cada aplicación', false, 3),
        (2, 'Ensayo de Espesamiento Estático', 'espesamiento-estatico', 'Pruebas de sedimentación y selección de floculantes', true, 1),
        (2, 'Ensayo de Espesamiento Dinámico', 'espesamiento-dinamico', 'Simulación continua de espesadores a escala piloto', false, 2),
        (3, 'Ensayo de Flotación Batch', 'flotacion-batch', 'Pruebas de flotación a nivel laboratorio para determinar recuperaciones', false, 1),
        (3, 'Ensayo de Flotación Continua', 'flotacion-continua', 'Circuito de flotación piloto para validación de parámetros', false, 2),
        (4, 'Lixiviación en Columna', 'lixiviacion-columna', 'Ensayos de percolación para recuperación de cobre, oro y otros', false, 1),
        (4, 'Lixiviación por Agitación', 'lixiviacion-agitacion', 'Pruebas de disolución en reactor agitado', false, 2),
        (5, 'Pilotaje de Filtración', 'pilotaje-filtracion', 'Operación de filtro prensa piloto en planta del cliente', true, 1),
        (5, 'Pilotaje de Espesamiento', 'pilotaje-espesamiento', 'Operación de espesador piloto en campo', false, 2),
        (6, 'Montaje de Filtros Prensa', 'montaje-filtros', 'Instalación completa de filtros prensa industriales', false, 1),
        (6, 'Montaje de Espesadores', 'montaje-espesadores', 'Instalación y puesta en marcha de espesadores', false, 2)
      ON CONFLICT (slug) DO NOTHING;
    `);
    console.log('  ✅ 13 servicios creados');

    // ==================== 4. PRODUCTOS ====================
    await client.query(`
      INSERT INTO products (name, slug, category, short_description, origin, specifications, sort_order) VALUES
        ('Filtro Prensa Automático FPA-1500', 'filtro-prensa-fpa-1500', 'Filtros Prensa', 'Filtro prensa de placas con sistema automático de descarga', 'Italia', '{"capacidad": "50 m³/h", "presion_max": "16 bar", "area_filtracion": "200 m²", "placas": 80}', 1),
        ('Filtro Prensa Manual FPM-800', 'filtro-prensa-fpm-800', 'Filtros Prensa', 'Filtro prensa manual para operaciones de menor escala', 'Italia', '{"capacidad": "15 m³/h", "presion_max": "12 bar", "area_filtracion": "60 m²", "placas": 30}', 2),
        ('Bomba de Alimentación BA-200', 'bomba-alimentacion-ba-200', 'Bombas', 'Bomba centrífuga para alimentación de filtros prensa', 'Sudáfrica', '{"caudal_max": "200 m³/h", "presion_max": "10 bar", "potencia": "75 kW"}', 3),
        ('Espesador de Alta Capacidad EAC-20', 'espesador-eac-20', 'Espesadores', 'Espesador de 20m de diámetro para alta capacidad', 'Italia', '{"diametro": "20 m", "capacidad": "500 TPD", "tipo": "Alta capacidad"}', 4),
        ('Decanter Centrífugo DC-450', 'decanter-dc-450', 'Decanters', 'Centrífuga decanter para deshidratación de lodos', 'Italia', '{"capacidad": "45 m³/h", "velocidad": "3200 RPM", "potencia": "55 kW"}', 5),
        ('Bomba de Diafragma BD-100', 'bomba-diafragma-bd-100', 'Bombas', 'Bomba neumática de doble diafragma para pulpas abrasivas', 'Sudáfrica', '{"caudal_max": "100 m³/h", "solidos_max": "70%", "presion_max": "8 bar"}', 6)
      ON CONFLICT (slug) DO NOTHING;
    `);
    console.log('  ✅ 6 productos/equipos creados');

    // ==================== 5. LEADS DEMO ====================
    await client.query(`
      INSERT INTO leads (contact_name, contact_email, contact_phone, company_name, company_sector, source, service_interest, message, status, priority) VALUES
        ('Roberto Silva', 'rsilva@minerasur.com', '+51 999 333 001', 'Minera Sur SAC', 'Minería', 'WEB', 'Filtración', 'Necesitamos evaluar filtros prensa para nuestra planta de relaves', 'NEW', 'HIGH'),
        ('Patricia Vargas', 'pvargas@cementos-peru.com', '+51 999 333 002', 'Cementos Perú', 'Industrial', 'REFERRAL', 'Espesamiento', 'Consulta sobre espesadores para nuestra línea de producción', 'CONTACTED', 'MEDIUM'),
        ('Luis Quispe', 'lquispe@goldmining.com', '+51 999 333 003', 'Gold Mining Corp', 'Minería', 'EVENT', 'Lixiviación', 'Interesados en ensayos de lixiviación para proyecto aurífero', 'PROPOSAL', 'URGENT')
      ON CONFLICT DO NOTHING;
    `);
    console.log('  ✅ 3 leads demo creados');

    console.log('\n[Dewatering] 🎉 Seed completado exitosamente!');
    console.log('  📧 Login admin: admin@dewatering.com / Admin@2026');
    console.log('  📧 Login ventas: ventas@dewatering.com / Sales@2026');
    console.log('  📧 Login ingeniero: ingenieria@dewatering.com / Eng@2026!');
    console.log('  📧 Login cliente: contacto@minera-andina.com / Client@2026');

  } catch (error) {
    console.error('[Dewatering] ❌ Error en seed:', error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seed();
