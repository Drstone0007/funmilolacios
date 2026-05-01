import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function chatWithGemini(systemPrompt: string, userPrompt: string) {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: userPrompt,
    config: { systemInstruction: systemPrompt }
  });
  return response.text || "";
}

export async function streamGemini(systemPrompt: string, userPrompt: string, onChunk: (chunk: string) => void) {
  const response = await ai.models.generateContentStream({
    model: "gemini-3-flash-preview",
    contents: userPrompt,
    config: { systemInstruction: systemPrompt }
  });

  let fullText = "";
  for await (const chunk of response) {
    const chunkText = chunk.text || "";
    fullText += chunkText;
    onChunk(chunkText);
  }
  return fullText;
}
