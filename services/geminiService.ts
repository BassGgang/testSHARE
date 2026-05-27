
import { GoogleGenAI, Type } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

export const optimizeMetadata = async (title: string, description: string) => {
  const ai = getAIClient();
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Please optimize the following academic video metadata for Todai TV (University of Tokyo's OCW). 
    Original Title: ${title}
    Original Description: ${description}
    
    Provide:
    1. A more catchy yet academic suggested title.
    2. A concise summary (max 200 words) in professional Japanese.
    3. A list of 5 relevant keywords/tags.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          suggestedTitle: { type: Type.STRING },
          summary: { type: Type.STRING },
          tags: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["suggestedTitle", "summary", "tags"]
      }
    }
  });

  return JSON.parse(response.text);
};
