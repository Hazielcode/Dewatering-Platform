import 'dotenv/config';
import { query } from './src/config/db.js';
import productModel from './src/models/productModel.js';

const productsToSeed = [
  {
    name: 'Filtro Prensa Dewatering de Alta Presión',
    slug: 'filtro-prensa-dewatering',
    category: 'Separación Sólido-Líquido',
    short_description: 'Equipo robusto diseñado para la máxima recuperación de agua y generación de relaves secos (dry stacking).',
    origin: 'Italia',
    is_active: true
  },
  {
    name: 'Espesador Clarificador Roytec',
    slug: 'espesador-clarificador-roytec',
    category: 'Separación Sólido-Líquido',
    short_description: 'Espesadores de alta tasa para la clarificación de aguas y recuperación de minerales.',
    origin: 'Sudáfrica',
    is_active: true
  },
  {
    name: 'Bomba Centrífuga Pemo para Lodos',
    slug: 'bomba-centrifuga-pemo',
    category: 'Bombeo Industrial',
    short_description: 'Bombas anti-abrasivas especiales para transporte de pulpas y lodos densos.',
    origin: 'Italia',
    is_active: true
  },
  {
    name: 'Centrífuga Industrial Decanter',
    slug: 'centrifuga-industrial',
    category: 'Separación Sólido-Líquido',
    short_description: 'Tecnología de decantación centrífuga para separación continua de fases.',
    origin: 'Europa',
    is_active: true
  }
];

async function seed() {
  try {
    for (const prod of productsToSeed) {
      // Check if exists
      const existing = await productModel.findBySlug(prod.slug);
      if (!existing) {
        await productModel.create(prod);
        console.log(`Created product: ${prod.name}`);
      } else {
        console.log(`Product already exists: ${prod.name}`);
      }
    }

    // Now, create a document for RAG so the chatbot knows about the inventory
    const inventoryText = `
CATÁLOGO OFICIAL DE EQUIPOS Y PRODUCTOS - DEWATERING SOLUTIONS

1. Filtro Prensa Dewatering de Alta Presión
   - Categoría: Separación Sólido-Líquido
   - Origen: Italia
   - Descripción: Equipo robusto diseñado para la máxima recuperación de agua y generación de relaves secos (dry stacking). Soporta alta presión para lograr humedades muy bajas en el queque.

2. Espesador Clarificador Roytec
   - Categoría: Separación Sólido-Líquido
   - Origen: Sudáfrica
   - Descripción: Espesadores de alta tasa para la clarificación de aguas y recuperación de minerales. Optimizan el uso de floculantes y maximizan la claridad del rebose.

3. Bomba Centrífuga Pemo para Lodos
   - Categoría: Bombeo Industrial
   - Origen: Italia
   - Descripción: Bombas anti-abrasivas especiales para transporte de pulpas y lodos densos. Diseño resistente al desgaste continuo.

4. Centrífuga Industrial Decanter
   - Categoría: Separación Sólido-Líquido
   - Origen: Europa
   - Descripción: Tecnología de decantación centrífuga para separación continua de fases, ideal para procesos químicos y aguas residuales.
    `;

    // Check if RAG document exists
    const docRes = await query(`SELECT id FROM documents WHERE title = 'Catálogo Oficial de Inventario'`);
    if (docRes.rows.length === 0) {
      // Need to create embeddings for this text if we want it in RAG.
      // But we can't easily do it from this simple script without calling the Gemini API.
      // The easiest way is to let the Admin do it via the AI Training Page, or we can just insert the text and tell the user to train it.
      console.log('Skipping RAG embedding here, user should train it or we can do it via API route.');
    }

    console.log('Seed complete.');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
