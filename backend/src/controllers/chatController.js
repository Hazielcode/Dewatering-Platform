import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
let ai;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
} else {
  console.warn('[Dewatering] ⚠️ GEMINI_API_KEY no está configurada en el entorno.');
}
// Contexto inicial del sistema (System Prompt RAG simulado)
const systemContext = `
Eres el "Ingeniero Virtual" de Dewatering Solutions.
Tu objetivo es asistir a ingenieros, superintendentes y clientes respondiendo preguntas técnicas sobre separación sólido-líquido, espesamiento, filtración, y los manuales de equipos.
Responde de forma profesional, directa y experta, como un ingeniero metalurgista o industrial.
Si no sabes algo, indica que el usuario debe consultar con el equipo comercial de Dewatering Solutions.
Limítate a responder sobre procesos industriales, minería, tratamiento de agua y servicios de la empresa.
Usa un formato limpio, estructurado y visualmente agradable. Emplea viñetas cortas, listas claras y párrafos muy breves. Evita escribir textos demasiado largos o agobiantes para la vista del usuario en el chat. No utilices fórmulas matemáticas complejas como LaTeX, prefiere un lenguaje directo y práctico.
`;

export const chatWithBot = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }

    if (!ai) {
      return res.status(503).json({ error: 'El servicio de IA no está configurado en el servidor (GEMINI_API_KEY faltante).' });
    }

    // El historial que viene del frontend no tiene el formato exacto del nuevo SDK
    // Convertimos el historial al formato esperado
    const formattedContents = [];
    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        formattedContents.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    // Añadir el mensaje actual del usuario
    formattedContents.push({
      role: 'user',
      parts: [{ text: message }]
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedContents,
      config: {
        systemInstruction: systemContext,
        temperature: 0.3,
        maxOutputTokens: 2048
      }
    });

    res.status(200).json({ response: response.text });
  } catch (error) {
    console.error('[ChatBot Error]:', error);
    res.status(500).json({ error: 'Error al comunicarse con la IA. El servidor de IA podría estar saturado.' });
  }
};

