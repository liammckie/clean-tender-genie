
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the service account key from environment variables
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT');
    
    if (!serviceAccountKey) {
      throw new Error('Google Drive service account key not found in environment variables');
    }

    let serviceAccountJson;
    try {
      // Parse the service account key as JSON
      serviceAccountJson = JSON.parse(serviceAccountKey);
      
      // Log information about the key (sanitized for security)
      const keyInfo = {
        keyExists: true,
        type: serviceAccountJson.type,
        projectId: serviceAccountJson.project_id,
        clientEmail: serviceAccountJson.client_email,
        privateKeyExists: !!serviceAccountJson.private_key,
      };

      console.log('Service account key information:', keyInfo);
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Service account key found and valid',
          keyInfo,
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200,
        }
      );
    } catch (parseError) {
      console.error('Error parsing service account key as JSON:', parseError);
      throw new Error('Invalid service account key format: not valid JSON');
    }
  } catch (error) {
    console.error('Error testing Google Drive service account key:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
