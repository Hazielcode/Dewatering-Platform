/**
 * Middleware Global de Manejo de Errores — Dewatering Solutions
 */
const errorHandler = (err, req, res, _next) => {
  console.error('[Dewatering] ❌ Error:', err.message || err);

  // Errores PostgreSQL conocidos
  if (err.code === '23505') return res.status(409).json({ error: 'El registro ya existe (violación UNIQUE).' });
  if (err.code === '23503') return res.status(409).json({ error: 'No se puede completar por dependencias existentes.' });
  if (err.code === '23502') return res.status(400).json({ error: 'Falta un campo obligatorio.' });

  if (err.name === 'ValidationError') return res.status(400).json({ error: err.message });

  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production'
    ? 'Error interno del servidor.'
    : err.message || 'Error interno del servidor.';

  res.status(statusCode).json({ error: message });
};

export default errorHandler;
