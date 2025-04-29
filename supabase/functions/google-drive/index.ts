
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { google } from "npm:googleapis@126.0.1";

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

    // Parse the JWT to get credentials
    let credentials;
    try {
      credentials = JSON.parse(atob(serviceRoleKey.split('.')[1]));
    } catch (e) {
      console.error('Error parsing service key JWT:', e);
      throw new Error('Invalid service key format');
    }

    // Create a Google auth client using the service key
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/drive.readonly']
    );

    // Initialize the Google Drive API client
    const drive = google.drive({ version: 'v3', auth });
    
    // Parse the request body to determine the action
    const { action, folderId, fileId, fileName } = await req.json();
    
    let result = null;
    
    // Handle different actions
    switch (action) {
      case 'listFiles': {
        // Default to the root folder specified in the request if no folderId provided
        const targetFolderId = folderId || '1ULtJBBqNdJXHadeW0RfBpvYqRvV2VOTi';
        
        console.log(`Listing files in folder: ${targetFolderId}`);
        
        // Query for files and folders in the specified folder
        const response = await drive.files.list({
          q: `'${targetFolderId}' in parents and trashed = false`,
          fields: 'files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink)',
          orderBy: 'folder,name'
        });
        
        result = {
          files: response.data.files,
          currentFolderId: targetFolderId
        };
        break;
      }
      
      case 'getFileMetadata': {
        if (!fileId) {
          throw new Error('fileId is required for getFileMetadata action');
        }
        
        const response = await drive.files.get({
          fileId: fileId,
          fields: 'id, name, mimeType, createdTime, modifiedTime, size, webViewLink, parents'
        });
        
        result = response.data;
        break;
      }
      
      case 'downloadFile': {
        if (!fileId) {
          throw new Error('fileId is required for downloadFile action');
        }
        
        // Get file metadata to check its type
        const fileMetadata = await drive.files.get({
          fileId: fileId,
          fields: 'id, name, mimeType'
        });
        
        // Download the file content
        const response = await drive.files.get({
          fileId: fileId,
          alt: 'media'
        }, { responseType: 'arraybuffer' });
        
        // Convert the file content to base64
        const content = btoa(String.fromCharCode(...new Uint8Array(response.data)));
        
        result = {
          id: fileId,
          name: fileMetadata.data.name,
          mimeType: fileMetadata.data.mimeType,
          content: content
        };
        break;
      }
      
      case 'createGoogleDoc': {
        if (!fileName) {
          throw new Error('fileName is required for createGoogleDoc action');
        }
        
        // Create a new Google Doc
        const fileMetadata = {
          name: fileName,
          mimeType: 'application/vnd.google-apps.document',
          parents: folderId ? [folderId] : ['1ULtJBBqNdJXHadeW0RfBpvYqRvV2VOTi']
        };
        
        const response = await drive.files.create({
          requestBody: fileMetadata,
          fields: 'id, name, webViewLink'
        });
        
        result = response.data;
        break;
      }

      case 'updateGoogleDoc': {
        if (!fileId) {
          throw new Error('fileId is required for updateGoogleDoc action');
        }
        
        const { content } = await req.json();
        
        if (!content) {
          throw new Error('content is required for updateGoogleDoc action');
        }
        
        // Update the Google Doc content
        const response = await drive.files.update({
          fileId: fileId,
          requestBody: { 
            content: content
          },
          fields: 'id, name, webViewLink'
        });
        
        result = response.data;
        break;
      }
      
      default:
        throw new Error(`Unknown action: ${action}`);
    }

    return new Response(JSON.stringify({
      success: true,
      data: result
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error executing Google Drive function:', error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
    }), { 
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
