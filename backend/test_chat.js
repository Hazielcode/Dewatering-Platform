import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });
    const chat = model.startChat({
      history: [
        { role: "user", parts: [{ text: "Hello" }] },
        { role: "model", parts: [{ text: "Hi there!" }] }
      ]
    });
    const result = await chat.sendMessage("1+1");
    console.log("Success:", result.response.text());
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
