import { query } from '../config/db.js';
import { GoogleGenAI } from '@google/genai';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

// Función simple para dividir texto en chunks de aprox 1000 caracteres
function chunkText(text, maxChars = 1000) {
  const chunks = [];
  let currentChunk = '';
  const paragraphs = text.split('\n');

  for (const p of paragraphs) {
    if ((currentChunk.length + p.length) > maxChars && currentChunk.length > 0) {
      chunks.push(currentChunk.trim());
      currentChunk = '';
    }
    currentChunk += p + '\n';
  }
  if (currentChunk.trim().length > 0) {
    chunks.push(currentChunk.trim());
  }
  return chunks;
}

export const trainAI = async (req, res) => {
  try {
    const { sourceName, textContent } = req.body;
    const userId = req.user.id; 

    if (!ai) return res.status(503).json({ error: 'GEMINI_API_KEY no configurada.' });

    // 0. Ensure embedding column is 768 for Gemini (if it was created as 1536)
    try {
      await query(`ALTER TABLE document_embeddings ALTER COLUMN embedding TYPE vector(768)`);
    } catch (e) {
      // Ignorar si ya es 768 o si hay error (podría haber datos)
      console.log('Nota: no se pudo alterar a vector(768) o ya estaba configurado.');
    }

    // 1. Crear documento maestro (categoría RAG_KNOWLEDGE para identificarlo)
    const docRes = await query(
      `INSERT INTO documents (title, description, category, file_url, is_public, uploaded_by) 
       VALUES ($1, $2, 'RAG_KNOWLEDGE', 'TEXT_INPUT', true, $3) RETURNING id`,
      [sourceName, 'Conocimiento inyectado vía panel de entrenamiento IA', userId]
    );
    const docId = docRes.rows[0].id;

    // 2. Dividir texto
    const chunks = chunkText(textContent, 1000);

    // 3. Generar embeddings y guardar en pgvector
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (chunk.length < 10) continue; // skip very small chunks

      const embeddingRes = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: chunk
      });
      const vector = embeddingRes.embeddings[0].values; 
      const vectorStr = `[${vector.join(',')}]`;

      await query(
        `INSERT INTO document_embeddings (document_id, chunk_index, chunk_text, embedding, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [docId, i, chunk, vectorStr, JSON.stringify({ source: sourceName })]
      );
    }

    res.status(200).json({ 
      message: 'Conocimiento inyectado con éxito', 
      chunksProcessed: chunks.length,
      docId
    });
  } catch (error) {
    console.error('[AI Training Error]:', error);
    res.status(500).json({ error: 'Error al entrenar la IA' });
  }
};

export const getTrainedDocs = async (req, res) => {
  try {
    const result = await query(
      `SELECT id, title as name, created_at as date, 
       (SELECT COUNT(*) FROM document_embeddings WHERE document_id = d.id) as chunks
       FROM documents d
       WHERE category = 'RAG_KNOWLEDGE'
       ORDER BY created_at DESC`
    );
    
    // Formatear la fecha y los "tokens" aproximados (chunks * 250)
    const docs = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      tokens: row.chunks * 250,
      date: new Date(row.date).toISOString().split('T')[0]
    }));

    res.status(200).json(docs);
  } catch (error) {
    console.error('[Get Trained Docs Error]:', error);
    res.status(500).json({ error: 'Error al obtener documentos entrenados' });
  }
};

export const trainFromFile = async (req, res) => {
  try {
    const file = req.file;
    const sourceName = req.body.sourceName || file.originalname;
    const userId = req.user.id;

    if (!file) return res.status(400).json({ error: 'No se envió ningún archivo.' });
    if (!ai) return res.status(503).json({ error: 'GEMINI_API_KEY no configurada.' });

    let extractedText = '';

    const mimeType = file.mimetype;
    
    if (mimeType === 'application/pdf') {
      const pdfData = await pdfParse(file.buffer);
      extractedText = pdfData.text;
    } else if (
      mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || 
      mimeType === 'application/msword'
    ) {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      extractedText = result.value;
    } else if (mimeType.startsWith('image/')) {
      // Usar Gemini Visión para extraer texto de imágenes
      const response = await ai.models.generateContent({
        model: 'gemini-3.5-flash',
        contents: [
          { role: 'user', parts: [
            { text: 'Extrae todo el texto técnico y datos de esta imagen con la mayor precisión posible. Formatea como texto limpio.' },
            { inlineData: { data: file.buffer.toString('base64'), mimeType: file.mimetype } }
          ]}
        ]
      });
      extractedText = response.text;
    } else {
      return res.status(400).json({ error: 'Formato de archivo no soportado. Usa PDF, Word o Imágenes.' });
    }

    if (!extractedText || extractedText.trim().length === 0) {
      return res.status(400).json({ error: 'No se pudo extraer texto del archivo.' });
    }

    // 0. Ensure embedding column is 768
    try { await query(`ALTER TABLE document_embeddings ALTER COLUMN embedding TYPE vector(768)`); } catch (e) {}

    // 1. Crear documento
    const docRes = await query(
      `INSERT INTO documents (title, description, category, file_url, is_public, uploaded_by) 
       VALUES ($1, $2, 'RAG_KNOWLEDGE', 'FILE_UPLOAD', true, $3) RETURNING id`,
      [sourceName, 'Conocimiento inyectado vía archivo', userId]
    );
    const docId = docRes.rows[0].id;

    // 2. Dividir texto
    const chunks = chunkText(extractedText, 1000);

    // 3. Generar embeddings
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      if (chunk.length < 10) continue;

      const embeddingRes = await ai.models.embedContent({
          model: 'text-embedding-004',
          contents: chunk
      });
      const vector = embeddingRes.embeddings[0].values; 
      const vectorStr = `[${vector.join(',')}]`;

      await query(
        `INSERT INTO document_embeddings (document_id, chunk_index, chunk_text, embedding, metadata)
         VALUES ($1, $2, $3, $4, $5)`,
        [docId, i, chunk, vectorStr, JSON.stringify({ source: sourceName })]
      );
    }

    res.status(200).json({ 
      message: 'Archivo procesado e inyectado con éxito', 
      chunksProcessed: chunks.length,
      docId
    });

  } catch (error) {
    console.error('[AI File Training Error]:', error);
    res.status(500).json({ error: 'Error procesando el archivo.' });
  }
};
