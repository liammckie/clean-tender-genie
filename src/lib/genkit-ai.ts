
import { createClient } from "@genkit-ai/ai";

// Function to initialize the GenKit client with API key
export const initGenKitClient = (apiKey: string) => {
  if (!apiKey) {
    throw new Error("GenKit API key is required");
  }
  
  return createClient({ apiKey });
};

// Function to generate content using GenKit
export const generateWithGenKit = async (
  client: ReturnType<typeof createClient>,
  prompt: string,
  options: {
    temperature?: number;
    maxTokens?: number;
  } = {}
) => {
  try {
    const completion = await client.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gemini-pro", // Default model
      temperature: options.temperature || 0.7,
      max_tokens: options.maxTokens || 1000,
    });
    
    return completion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Error generating content with GenKit:", error);
    throw error;
  }
};
