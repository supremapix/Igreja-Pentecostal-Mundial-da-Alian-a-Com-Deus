
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getDailyVerse = async () => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: 'Sugira um versículo bíblico inspirador do dia para uma igreja pentecostal em português, inclua a referência e uma breve mensagem de reflexão de 2 frases. Retorne em formato JSON: { "verse": "...", "reference": "...", "reflection": "..." }',
      config: {
        responseMimeType: 'application/json'
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Erro ao buscar versículo:", error);
    return {
      verse: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna.",
      reference: "João 3:16",
      reflection: "O amor de Deus é a base de toda a nossa fé. Que este amor transforme o seu dia hoje."
    };
  }
};
