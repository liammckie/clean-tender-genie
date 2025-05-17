import { supabase } from '@/integrations/supabase/client';

export interface TenderAnalysis {
  summary: string;
  legalRequirements: string[];
  operationalNeeds: string[];
  estimationConsiderations: string[];
  keyCriteria: string[];
  winThemes: string[];
}

export const vertexAiService = {
  async analyzeTender(text: string): Promise<TenderAnalysis> {
    const response = await supabase.functions.invoke('vertex-review', {
      body: {
        action: 'analyzeTender',
        text
      }
    });

    if (response.error) {
      throw new Error(response.error.message || 'Failed to analyze tender');
    }

    const data = response.data;
    if (!data || !data.success || !data.data) {
      throw new Error('Invalid analysis response');
    }

    return data.data as TenderAnalysis;
  }
};
