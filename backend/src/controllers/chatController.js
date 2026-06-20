import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Contexto inicial del sistema (System Prompt RAG simulado)
const systemContext = `
Eres el "Ingeniero Virtual" de Dewatering Solutions.
Tu objetivo es asistir a ingenieros, superintendentes y clientes respondiendo preguntas técnicas sobre separación sólido-líquido, espesamiento, filtración, y los manuales de equipos.
Responde de forma profesional, directa y experta, como un ingeniero metalurgista o industrial.
Si no sabes algo, indica que el usuario debe consultar con el equipo comercial de Dewatering Solutions.
Limítate a responder sobre procesos industriales, minería, tratamiento de agua y servicios de la empresa.
`;

export const chatWithBot = async (req, res) => {
  try {
    const { message, history } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'El mensaje no puede estar vacío.' });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    // Preparar el historial en formato Gemini
    // Formato de Gemini: { role: 'user' | 'model', parts: [{text: '...'}] }
    const formattedHistory = [
      { role: "user", parts: [{ text: systemContext }] },
      { role: "model", parts: [{ text: "Entendido. Soy el Ingeniero Virtual de Dewatering Solutions. ¿En qué puedo ayudarle hoy?" }] },
    ];

    if (history && Array.isArray(history)) {
      history.forEach(msg => {
        formattedHistory.push({
          role: msg.role === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }]
        });
      });
    }

    const chat = model.startChat({
      history: formattedHistory,
      generationConfig: {
        maxOutputTokens: 500,
        temperature: 0.3, // Respuestas más técnicas y menos creativas
      },
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ response: text });
  } catch (error) {
    console.error('[ChatBot Error]:', error);
    res.status(500).json({ error: 'Error al comunicarse con la IA. El servidor de IA podría estar saturado.' });
  }
};
