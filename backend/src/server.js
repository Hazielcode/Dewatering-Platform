import app from './app.js';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const dbResult = await pool.query('SELECT NOW() AS server_time');
    console.log(`[Dewatering] 📦 PostgreSQL conectado. Hora DB: ${dbResult.rows[0].server_time}`);
  } catch (error) {
    console.error('[Dewatering] ⚠️ Advertencia: No se pudo conectar a PostgreSQL al inicio.');
    console.error('[Dewatering] 💡 Detalle del error:', error.message);
    console.error('[Dewatering] ⚠️ Iniciando el servidor de todas formas (Modo Offline o Red Restringida).');
  }

  // Iniciar la API siempre, incluso si la base de datos falla por red de la universidad
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Dewatering] 🚀 API iniciada en puerto ${PORT}`);
    console.log(`[Dewatering] 🛡️  Entorno: ${process.env.NODE_ENV || 'development'}`);
    console.log(`[Dewatering] 📋 Health: http://localhost:${PORT}/api/health`);
  });
};

startServer();
