import { createOpenAI } from "@ai-sdk/openai";

// Create OpenAI client with the AI SDK
// The apiKey will automatically default to the OPENAI_API_KEY environment variable
export const openai = createOpenAI({
  compatibility: "strict", // Use strict mode for the official OpenAI API
  // The API key will automatically use OPENAI_API_KEY from environment variables
});