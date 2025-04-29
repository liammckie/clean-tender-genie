
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
    // Get the service role key from environment variables
    const serviceRoleKey = Deno.env.get('serice-ROLE'); // Note: using the key with the typo as stored
    
    if (!serviceRoleKey) {
      throw new Error('Google Drive service role key not found in environment variables');
    }

    // Log information about the key (sanitized for security)
    const keyInfo = {
      keyExists: !!serviceRoleKey,
      keyLength: serviceRoleKey.length,
      keyPrefix: serviceRoleKey.substring(0, 10) + '...',
    };

    console.log('Service key information:', keyInfo);
    
    // Test basic JWT parsing if it appears to be a JWT token
    let tokenParts = null;
    if (serviceRoleKey.includes('.')) {
      try {
        tokenParts = serviceRoleKey.split('.').length;
      } catch (e) {
        console.error('Error parsing JWT token:', e);
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Service role key found',
        keyInfo,
        tokenParts,
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error testing Google Drive service role key:', error);
    
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
