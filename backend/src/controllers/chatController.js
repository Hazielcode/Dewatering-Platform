import { GoogleGenAI } from '@google/genai';
import { query } from '../config/db.js';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('[Dewatering] ⚠️ GEMINI_API_KEY no está configurada en el entorno.');
}

const baseSystemContext = `
Eres el "Ingeniero Virtual" de Dewatering Solutions.
Tu objetivo es asistir a ingenieros, superintendentes y clientes.
Responde de forma profesional, experta, como un ingeniero metalurgista o industrial.
Eres capaz de resolver cálculos matemáticos, dimensionamiento y dar consejos de ingeniería general usando tu conocimiento general.
PERO, si te preguntan sobre Dewatering Solutions, equipos específicos de la empresa, o documentos privados del cliente, DEBES basarte EXCLUSIVAMENTE en la "Memoria RAG" que se te proporciona más abajo.
Si no sabes algo o no está en la memoria RAG, indica que el usuario debe consultar con el equipo comercial de Dewatering Solutions.
Usa un formato limpio, estructurado y visualmente agradable. Emplea viñetas cortas, listas claras y párrafos muy breves. No utilices LaTeX complejo.
`;

export const chatWithBot = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'El servicio de IA no está configurado.' });
    }

    // 1. Convertir el mensaje del usuario en Vectores (Embedding)
    let ragContext = '';
    try {
      const embeddingRes = await ai.models.embedContent({
        model: 'gemini-embedding-2',
        contents: message,
        config: { outputDimensionality: 768 }
      });
      const vector = embeddingRes.embeddings[0].values;
      const vectorStr = `[${vector.join(',')}]`;

      // 2. Buscar en la Base de Datos los textos más similares (Cosine Similarity)
      // Usamos el operador <=> de pgvector para distancia coseno
      const searchRes = await query(
        `SELECT chunk_text, 1 - (embedding <=> $1) as similarity 
         FROM document_embeddings 
         ORDER BY embedding <=> $1 
         LIMIT 3`,
        [vectorStr]
      );

      if (searchRes.rows.length > 0) {
        ragContext = searchRes.rows
          .filter(row => row.similarity > 0.4) // Filtrar cosas no relacionadas
          .map(row => row.chunk_text)
          .join('\\n\\n');
      }
    } catch (dbError) {
      console.warn('[RAG Search Warning]: No se pudo buscar en la base de datos vectorial.', dbError.message);
    }

    // 3. Inyectar el contexto RAG al System Prompt
    const dynamicSystemContext = `${baseSystemContext}\n\n--- MEMORIA RAG ENCONTRADA ---\n${ragContext ? ragContext : '(No se encontraron documentos específicos. Usa tu conocimiento general)'}\n------------------------------`;

    // 4. Formatear historial
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        formattedContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    // 5. Llamar a Gemini con el contexto inyectado
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: dynamicSystemContext,
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    });

    res.status(200).json({ response: response.text });
  } catch (error) {
    console.error('[ChatBot Error]:', error);
    res.status(500).json({ error: 'Error al comunicarse con la IA.' });
  }
};


