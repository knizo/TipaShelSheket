import { GoogleGenAI } from "@google/genai";

// Always use the process.env.API_KEY directly as per rules
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateContentDescription = async (title: string, type: string): Promise<string> => {
  if (!process.env.API_KEY) return "Description generated (Mock: API Key missing).";

  try {
    const prompt = `You are a professional Yoga teacher. Write a short, calming, and inspiring description (max 2 sentences) for a yoga content piece titled "${title}" which is a ${type}.`;
    
    // Using gemini-3-flash-preview for basic text tasks
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });

    return response.text || "Namaste.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Could not generate description at this time.";
  }
};

export const chatWithYogaBot = async (history: {role: string, parts: string}[], message: string) => {
  if (!process.env.API_KEY) return "I am a simulated Yoga Assistant (API Key missing). How can I help?";

  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: "You are a helpful, calm, and knowledgeable Yoga Assistant for the app 'TipaShelSheket'. Answer questions about yoga poses, breathing, and scheduling briefly."
      },
      history: history.map(h => ({
        role: h.role === 'model' ? 'model' : 'user',
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