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
