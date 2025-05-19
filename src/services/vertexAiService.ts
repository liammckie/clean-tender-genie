import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseResponse } from './supabaseHelpers';

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
      body: { action: 'analyzeTender', text },
    });
    return handleSupabaseResponse<TenderAnalysis>(
      response,
      'Failed to analyze tender',
    );
  },

  async draftTender(text: string): Promise<string> {
    const response = await supabase.functions.invoke('vertex-draft', {
      body: { text },
    });
    const data = handleSupabaseResponse<{ draft: string }>(
      response,
      'Failed to draft tender',
    );
    return data.draft;
  },
};
