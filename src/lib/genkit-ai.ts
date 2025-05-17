
// Import directly from the package without trying to use createChat
import { AI } from '@genkit-ai/ai';

// Initialize the Genkit client
export const initGenkit = (apiKey: string) => {
  // Return client or utilities
  return {
    chat: new AI({
      apiKey: apiKey
    })
  };
};

// Function to generate content using Genkit
export const generateWithGenkit = async (
  apiKey: string,
  prompt: string,
): Promise<string> => {
  try {
    const genkitClient = initGenkit(apiKey);
    const response = await genkitClient.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
    });
    
    return response.choices[0]?.message?.content || 'No response generated';
  } catch (error) {
    console.error('Error generating content with Genkit:', error);
    throw new Error(`Genkit API error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
