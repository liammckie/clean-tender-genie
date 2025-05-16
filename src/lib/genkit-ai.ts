
import { GenKit } from '@genkit-ai/ai';

// Initialize GenKit with API key
// This should come from environment variables in production
let genkit: GenKit | null = null;

export const initGenkit = (apiKey: string) => {
  genkit = new GenKit({
    apiKey
  });
  
  return genkit;
};

export const getGenkit = () => {
  if (!genkit) {
    throw new Error('GenKit not initialized. Call initGenkit first with your API key.');
  }
  
  return genkit;
};

export const isGenkitInitialized = () => {
  return !!genkit;
};
