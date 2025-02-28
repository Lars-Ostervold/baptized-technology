import { OpenAI } from "@ai-sdk/openai";

// Use environment variable for API key
const apiKey = process.env.OPENAI_API_KEY;

// Throw a more helpful error if the API key is missing
if (!apiKey) {
  throw new Error("OPENAI_API_KEY is not defined in environment variables");
}

// Standard OpenAI client (for embeddings)
export const openai = new OpenAI({ apiKey });