
import { GoogleGenAI, Type } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeDocument = async (base64Image: string): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
        { text: "Act as a forensic document expert. Analyze this ID for AI-generation markers, synthetic textures, pixel-perfect edges, or deepfake artifacts. Return JSON: { isAiGenerated: boolean, score: number (0-1, where 1 is highly suspicious), reasoning: string }" }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isAiGenerated: { type: Type.BOOLEAN },
          score: { type: Type.NUMBER },
          reasoning: { type: Type.STRING },
        },
        required: ["isAiGenerated", "score", "reasoning"],
      }
    }
  });
  return JSON.parse(response.text || '{}');
};

export const analyzeLiveness = async (frame: string): Promise<any> => {
  const ai = getAI();
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: {
      parts: [
        { inlineData: { data: frame.split(',')[1], mimeType: 'image/jpeg' } },
        { text: "Analyze this camera frame for liveness. Check for display glare, mask edges, or static image markers. Return JSON: { isLive: boolean, livenessScore: number (0-1, 1 is definitely live) }" }
      ]
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isLive: { type: Type.BOOLEAN },
          livenessScore: { type: Type.NUMBER },
        },
        required: ["isLive", "livenessScore"],
      }
    }
  });
  return JSON.parse(response.text || '{}');
};
