import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Get a Gemini model instance.
 * Uses the API key defined in GEMINI_API_KEY environment variable.
 */
export const getGeminiModel = (modelName: string = "gemini-2.5-flash") => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not defined in environment variables");
  }

  const genAI = new GoogleGenerativeAI(apiKey);
  return genAI.getGenerativeModel({ model: modelName });
};

/**
 * Executes a generative task with automatic model fallback.
 */
export async function generateWithFallback(
  payload: any,
  primaryModel: string = "gemini-2.5-flash"
) {
  const models = [primaryModel, "gemini-pro"];
  let lastError = null;

  for (const modelName of models) {
    try {
      console.log(`🤖 AI: Trying model ${modelName}...`);
      const model = getGeminiModel(modelName);
      const result = await model.generateContent(payload);
      return result;
    } catch (error: any) {
      console.warn(`⚠️ AI: Model ${modelName} failed:`, error.message);
      lastError = error;
      // If it's a quote limit error (429), maybe wait or just try next
      if (error.status === 404 || error.status === 503) continue;
      throw error; // If it's a 400 or other fatal error, stop
    }
  }
  throw lastError;
}
