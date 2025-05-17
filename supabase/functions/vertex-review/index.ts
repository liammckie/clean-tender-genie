import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { GoogleAuth } from "npm:google-auth-library@9.0.0";

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

    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT');
    if (!serviceAccountKey) {
      throw new Error('Google service account key not configured');
    }

    const credentials = JSON.parse(serviceAccountKey);
    const auth = new GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/cloud-platform']
    });

    const client = await auth.getClient();
    const projectId = credentials.project_id;
    const location = Deno.env.get('VERTEX_LOCATION') || 'us-central1';
    const model = 'gemini-1.5-pro';

    const url = `https://${location}-aiplatform.googleapis.com/v1/projects/${projectId}/locations/${location}/publishers/google/models/${model}:generateContent`;

    const systemPrompt =
      'You are an AI assistant that analyses tender documents for SCS Group, a large Australian commercial cleaning company. '\
      + 'Return a JSON object with the fields: summary, legalRequirements, operationalNeeds, estimationConsiderations, keyCriteria and winThemes.';

    const requestBody = {
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\nTender:\n${text}` }] }
      ],
      generationConfig: { temperature: 0.2 }
    };

    const result = await client.request({ url, method: 'POST', data: requestBody });
    const aiData: any = result.data;

    let parsed;
    try {
      parsed = JSON.parse(aiData.candidates[0].content.parts[0].text);
    } catch (err) {
      console.error('Failed to parse AI response', err, aiData);
      throw new Error('Invalid AI response');
    }

    return new Response(
      JSON.stringify({ success: true, data: parsed }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
