import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateContentDescription = async (title: string, type: string): Promise<string> => {
  if (!apiKey) return "Description generated (Mock: API Key missing).";

  try {
    const model = ai.models;
    const prompt = `You are a professional Yoga teacher. Write a short, calming, and inspiring description (max 2 sentences) for a yoga content piece titled "${title}" which is a ${type}.`;
    
    const response = await model.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "Namaste.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate description at this time.";
  }
};

export const chatWithYogaBot = async (history: {role: string, parts: string}[], message: string) => {
  if (!apiKey) return "I am a simulated Yoga Assistant (API Key missing). How can I help?";

  try {
    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: "You are a helpful, calm, and knowledgeable Yoga Assistant for the app 'TipaShelSheket'. Answer questions about yoga poses, breathing, and scheduling briefly."
      },
      history: history.map(h => ({
        role: h.role,
        parts: [{ text: h.parts }]
      }))
    });

    const result = await chat.sendMessage({ message });
    return result.text;
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I am having trouble connecting to the universe right now. Please try again later.";
  }
};