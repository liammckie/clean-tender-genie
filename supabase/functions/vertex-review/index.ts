import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, text } = await req.json();

    if (action !== 'analyzeTender') {
      throw new Error(`Unknown action: ${action}`);
    }

    if (!text || typeof text !== 'string') {
      throw new Error('text is required for analyzeTender action');
    }

    // Placeholder analysis logic. In a real implementation this would call
    // Vertex AI Gemini Pro 2.5 to analyse the tender document text.
    const summary = text.split('\n')[0].slice(0, 200);

    const response = {
      summary,
      legalRequirements: ['Comply with WHS Act 2011', 'Meet environmental regulations'],
      operationalNeeds: ['Provide cleaning schedule', 'Supply trained staff'],
      estimationConsiderations: ['Include labour and materials', 'Allow for peak period costs'],
      keyCriteria: ['Experience', 'Capability', 'Value'],
      winThemes: ['Quality service', 'Cost effective', 'Reliability']
    };

    return new Response(
      JSON.stringify({ success: true, data: response }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
