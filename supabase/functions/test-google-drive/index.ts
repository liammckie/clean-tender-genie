
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
    console.log('Testing Google Drive service account key');
    
    // Get the service account key from environment variables
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT');
    
    if (!serviceAccountKey) {
      console.error('Google Drive service account key not found in environment variables');
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
        keyLength: serviceAccountKey.length,
        keyPrefix: serviceAccountKey.substring(0, 20) + '...',
      };

      console.log('Service account key information:', keyInfo);
      
      // Check if the key appears to be a valid service account key
      const requiredFields = ['type', 'project_id', 'private_key_id', 'private_key', 'client_email', 'client_id', 'auth_uri', 'token_uri'];
      const missingFields = requiredFields.filter(field => !serviceAccountJson[field]);
      
      if (missingFields.length > 0) {
        console.error('Service account key is missing required fields:', missingFields);
        return new Response(
          JSON.stringify({
            success: false,
            error: `Service account key is missing required fields: ${missingFields.join(', ')}`,
            keyInfo
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      
      // Check if the private key appears to be valid
      if (!serviceAccountJson.private_key.includes('BEGIN PRIVATE KEY') || 
          !serviceAccountJson.private_key.includes('END PRIVATE KEY')) {
        console.error('Service account private key appears to be malformed');
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Service account private key appears to be malformed',
            keyInfo
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      
      // Check if the service account email format is valid
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(serviceAccountJson.client_email)) {
        console.error('Service account email appears to be invalid');
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Service account email appears to be invalid',
            keyInfo
          }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
          }
        );
      }
      
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Service account key found and appears to be valid',
          keyInfo,
          tokenParts: serviceAccountJson.client_email ? 'Properly formatted' : 'Not valid'
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
