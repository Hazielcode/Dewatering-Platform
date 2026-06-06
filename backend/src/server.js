import app from './app.js';
import pool from './config/db.js';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    const dbResult = await pool.query('SELECT NOW() AS server_time');
    console.log(`[Dewatering] 📦 PostgreSQL conectado. Hora DB: ${dbResult.rows[0].server_time}`);

    app.listen(PORT, () => {
      console.log(`[Dewatering] 🚀 API iniciada en puerto ${PORT}`);
      console.log(`[Dewatering] 🛡️  Entorno: ${process.env.NODE_ENV || 'development'}`);
      console.log(`[Dewatering] 📋 Health: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('[Dewatering] ❌ Error al arrancar:', error.message);
    console.error('[Dewatering] 💡 ¿Está PostgreSQL corriendo? ¿Son correctas las credenciales en .env?');
    process.exit(1);
  }
};

startServer();
