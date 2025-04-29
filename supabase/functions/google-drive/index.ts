
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
    // Get the service account key from environment variables
    const serviceAccountKey = Deno.env.get('GOOGLE_SERVICE_ACCOUNT');
    
    if (!serviceAccountKey) {
      console.error('Google Drive service account key not found in environment variables');
      throw new Error('Google Drive service account key not found in environment variables');
    }

    // Parse the service account JSON
    let credentials;
    try {
      credentials = JSON.parse(serviceAccountKey);
      console.log('Service account credentials parsed successfully');
    } catch (parseError) {
      console.error('Error parsing service account key:', parseError);
      throw new Error('Invalid service account key format: not valid JSON');
    }

    // Create a Google auth client using the service account credentials
    const auth = new google.auth.JWT(
      credentials.client_email,
      null,
      credentials.private_key,
      ['https://www.googleapis.com/auth/drive']
    );

    // Initialize the Google Drive API client
    const drive = google.drive({ version: 'v3', auth });
    
    // Parse the request body to determine the action
    const requestData = await req.json();
    console.log('Request action:', requestData.action);
    
    const { action, folderId, fileId, fileName, content } = requestData;
    
    let result = null;
    
    // Handle different actions
    switch (action) {
      case 'listFiles': {
        // Default to the root folder specified in the request if no folderId provided
        const targetFolderId = folderId || '1ULtJBBqNdJXHadeW0RfBpvYqRvV2VOTi';
        
        console.log(`Listing files in folder: ${targetFolderId}`);
        
        try {
          // Query for files and folders in the specified folder
          const response = await drive.files.list({
            q: `'${targetFolderId}' in parents and trashed = false`,
            fields: 'files(id, name, mimeType, createdTime, modifiedTime, size, webViewLink)',
            orderBy: 'folder,name'
          });
          
          console.log('Files list response:', {
            status: response.status,
            fileCount: response.data.files?.length || 0
          });
          
          if (!response.data.files || response.data.files.length === 0) {
            console.log('No files found in the specified folder');
          }
          
          result = {
            files: response.data.files || [],
            currentFolderId: targetFolderId
          };
        } catch (listError) {
          console.error('Error listing files:', listError);
          throw new Error(`Failed to list files: ${listError.message}`);
        }
        break;
      }
      
      case 'getFileMetadata': {
        if (!fileId) {
          throw new Error('fileId is required for getFileMetadata action');
        }
        
        console.log(`Getting metadata for file: ${fileId}`);
        
        try {
          const response = await drive.files.get({
            fileId: fileId,
            fields: 'id, name, mimeType, createdTime, modifiedTime, size, webViewLink, parents'
          });
          
          console.log('File metadata response:', {
            status: response.status,
            fileName: response.data.name
          });
          
          result = response.data;
        } catch (metadataError) {
          console.error('Error getting file metadata:', metadataError);
          throw new Error(`Failed to get file metadata: ${metadataError.message}`);
        }
        break;
      }
      
      case 'downloadFile': {
        if (!fileId) {
          throw new Error('fileId is required for downloadFile action');
        }
        
        console.log(`Downloading file: ${fileId}`);
        
        try {
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
          
          console.log('File download response:', {
            status: response.status,
            fileName: fileMetadata.data.name,
            contentSize: response.data.byteLength
          });
          
          // Convert the file content to base64
          const content = btoa(String.fromCharCode(...new Uint8Array(response.data)));
          
          result = {
            id: fileId,
            name: fileMetadata.data.name,
            mimeType: fileMetadata.data.mimeType,
            content: content
          };
        } catch (downloadError) {
          console.error('Error downloading file:', downloadError);
          throw new Error(`Failed to download file: ${downloadError.message}`);
        }
        break;
      }
      
      case 'createGoogleDoc': {
        if (!fileName) {
          throw new Error('fileName is required for createGoogleDoc action');
        }
        
        console.log(`Creating Google Doc: ${fileName} in folder: ${folderId || 'default'}`);
        
        try {
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
          
          console.log('Google Doc creation response:', {
            status: response.status,
            fileId: response.data.id,
            fileName: response.data.name
          });
          
          result = response.data;
        } catch (createError) {
          console.error('Error creating Google Doc:', createError);
          throw new Error(`Failed to create Google Doc: ${createError.message}`);
        }
        break;
      }

      case 'updateGoogleDoc': {
        if (!fileId) {
          throw new Error('fileId is required for updateGoogleDoc action');
        }
        
        if (!content) {
          throw new Error('content is required for updateGoogleDoc action');
        }
        
        console.log(`Updating Google Doc: ${fileId}`);
        
        try {
          // Update the Google Doc content
          const response = await drive.files.update({
            fileId: fileId,
            requestBody: { 
              content: content
            },
            fields: 'id, name, webViewLink'
          });
          
          console.log('Google Doc update response:', {
            status: response.status,
            fileId: response.data.id,
            fileName: response.data.name
          });
          
          result = response.data;
        } catch (updateError) {
          console.error('Error updating Google Doc:', updateError);
          throw new Error(`Failed to update Google Doc: ${updateError.message}`);
        }
        break;
      }
      
      default:
        console.error(`Unknown action: ${action}`);
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
