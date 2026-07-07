import 'dotenv/config';
import { query } from './src/config/db.js';

const storesToSeed = [
  {
    nombre: 'Sede Principal Lima Sur',
    ubicacion: 'Lurín Industrial Mza. A Lote 4, Lima, Perú'
  },
  {
    nombre: 'Centro de Operaciones Callao',
    ubicacion: 'Av. Elmer Faucett 2851, Parque Industrial, Callao, Perú'
  }
];

async function seed() {
  try {
    for (const store of storesToSeed) {
      const existing = await query('SELECT * FROM stores WHERE nombre = $1', [store.nombre]);
      if (existing.rows.length === 0) {
        await query('INSERT INTO stores (nombre, ubicacion) VALUES ($1, $2)', [store.nombre, store.ubicacion]);
        console.log(`Created store: ${store.nombre}`);
      } else {
        console.log(`Store already exists: ${store.nombre}`);
      }
    }
    console.log('Stores seed complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
