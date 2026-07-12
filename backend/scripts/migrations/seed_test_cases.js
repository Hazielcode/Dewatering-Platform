import 'dotenv/config';
import pool from './src/config/db.js';
import bcrypt from 'bcrypt';

async function seedTestCases() {
  try {
    console.log('[Dewatering Solutions] 🧪 Iniciando carga de Casos de Prueba...');

    const passHash = await bcrypt.hash('Dewatering Solutions2026!', 12);

    // 1. Limpiar datos previos de prueba (opcional, para evitar duplicados)
    // Usamos DELETE para limpiar pero con cuidado de no romper la DB
    const testEmails = ['gerente@dewatering_solutions.com', 'empleado@dewatering_solutions.com', 'gerente_lima@dewatering_solutions.com', 'gerente_cusco@dewatering_solutions.com'];
    
    // Eliminar de las tablas hijas primero
    await pool.query('DELETE FROM audit_logs WHERE usuario_id IN (SELECT id FROM usuarios WHERE email = ANY($1))', [testEmails]);
    await pool.query('DELETE FROM usuario_roles WHERE usuario_id IN (SELECT id FROM usuarios WHERE email = ANY($1))', [testEmails]);
    await pool.query('DELETE FROM usuarios WHERE email = ANY($1)', [testEmails]);

    // 2. Asegurar que existan los roles y tiendas base
    await pool.query("INSERT INTO roles (id, nombre) VALUES (1, 'Admin'), (2, 'Gerente'), (3, 'Empleado'), (4, 'Auditor') ON CONFLICT (id) DO NOTHING;");
    await pool.query("INSERT INTO tiendas (id, nombre, ubicacion) VALUES (1, 'Sede Lima Central', 'Lima'), (2, 'Sede Cusco Plaza', 'Cusco') ON CONFLICT (id) DO NOTHING;");

    // 3. Crear Escenario: GERENTE LIMA
    const resGerente = await pool.query(
      "INSERT INTO usuarios (email, password_hash, nombres, apellidos, activo, tienda_id) VALUES ($1, $2, $3, $4, true, 1) RETURNING id",
      ['gerente@dewatering_solutions.com', passHash, 'Roberto', 'Gerente']
    );
    await pool.query("INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, 2)", [resGerente.rows[0].id]);

    // 4. Crear Escenario: EMPLEADO LIMA
    const resEmpleado = await pool.query(
      "INSERT INTO usuarios (email, password_hash, nombres, apellidos, activo, tienda_id) VALUES ($1, $2, $3, $4, true, 1) RETURNING id",
      ['empleado@dewatering_solutions.com', passHash, 'Juan', 'Empleado']
    );
    await pool.query("INSERT INTO usuario_roles (usuario_id, rol_id) VALUES ($1, 3)", [resEmpleado.rows[0].id]);

    // 5. Crear productos para probar ABAC
    await pool.query('DELETE FROM productos WHERE nombre IN ($1, $2)', ['Laptop HP Enterprise', 'Mouse Logitech Pro']);
    
    // Producto Premium en Lima
    await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock, categoria, tienda_id, es_premium) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      ['Laptop HP Enterprise', 'Laptop de alto rendimiento para gerencia', 4500.00, 10, 'Computo', 1, true]
    );

    // Producto Normal en Lima
    await pool.query(
      "INSERT INTO productos (nombre, descripcion, precio, stock, categoria, tienda_id, es_premium) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      ['Mouse Logitech Pro', 'Mouse inalámbrico oficina', 85.00, 50, 'Accesorios', 1, false]
    );

    console.log('[Dewatering Solutions] ✅ Datos de prueba cargados exitosamente.');
    console.log('[Dewatering Solutions] 👤 Usuarios: gerente@dewatering_solutions.com / empleado@dewatering_solutions.com');
    console.log('[Dewatering Solutions] 🔑 Contraseña: Dewatering Solutions2026!');
  } catch (error) {
    console.error('[Dewatering Solutions] ❌ Error en el seed:', error);
  } finally {
    await pool.end();
  }
}

seedTestCases();
