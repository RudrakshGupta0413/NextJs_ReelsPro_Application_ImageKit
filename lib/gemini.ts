import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined in environment variables");
}

const genAI = new GoogleGenerativeAI(apiKey);

export const getGeminiModel = (modelName: string = "gemini-2.5-flash") => {
  return genAI.getGenerativeModel({ model: modelName });
};
