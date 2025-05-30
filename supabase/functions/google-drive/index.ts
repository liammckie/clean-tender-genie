
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { google } from "npm:googleapis@126.0.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Google Workspace MIME types that need to be exported rather than downloaded directly
const GOOGLE_WORKSPACE_MIME_TYPES = [
  'application/vnd.google-apps.document', // Google Docs
  'application/vnd.google-apps.spreadsheet', // Google Sheets
  'application/vnd.google-apps.presentation', // Google Slides
  'application/vnd.google-apps.drawing', // Google Drawings
  'application/vnd.google-apps.form', // Google Forms
];

// Export format mapping for Google Workspace files
const EXPORT_FORMATS = {
  'application/vnd.google-apps.document': 'application/pdf',
  'application/vnd.google-apps.spreadsheet': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.google-apps.presentation': 'application/pdf',
  'application/vnd.google-apps.drawing': 'image/png',
  'application/vnd.google-apps.form': 'application/pdf',
};

// Export format for text content (for better display)
const TEXT_EXPORT_FORMATS = {
  'application/vnd.google-apps.document': 'text/plain',
  'application/vnd.google-apps.spreadsheet': 'text/csv',
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
          // Get file metadata first to determine the mime type
          const fileMetadata = await drive.files.get({
            fileId: fileId,
            fields: 'id, name, mimeType'
          });
          
          const mimeType = fileMetadata.data.mimeType;
          let content = '';
          let downloadedMimeType = mimeType;
          
          // Check if this is a Google Workspace file that needs to be exported
          if (GOOGLE_WORKSPACE_MIME_TYPES.includes(mimeType)) {
            console.log(`Detected Google Workspace file type: ${mimeType}, using export API`);
            
            // Try to export as text first for better display if it's a document or spreadsheet
            let exportMimeType = EXPORT_FORMATS[mimeType] || 'application/pdf';
            const textMimeType = TEXT_EXPORT_FORMATS[mimeType];
            
            try {
              // First attempt to export as text if available for this type
              if (textMimeType) {
                console.log(`Attempting to export as ${textMimeType} for better display`);
                const textExportResponse = await drive.files.export({
                  fileId: fileId,
                  mimeType: textMimeType
                }, { responseType: 'arraybuffer' });
                
                console.log('Text export response:', {
                  status: textExportResponse.status,
                  contentSize: textExportResponse.data.byteLength
                });
                
                // Convert the exported text content to base64
                content = btoa(String.fromCharCode(...new Uint8Array(textExportResponse.data)));
                downloadedMimeType = textMimeType;
              } else {
                throw new Error('Text export not available for this file type');
              }
            } catch (textExportError) {
              console.log('Text export failed, falling back to default format:', textExportError.message);
              
              // Fallback to PDF or other format
              const exportResponse = await drive.files.export({
                fileId: fileId,
                mimeType: exportMimeType
              }, { responseType: 'arraybuffer' });
              
              console.log('File export response:', {
                status: exportResponse.status,
                contentSize: exportResponse.data.byteLength
              });
              
              // Convert the exported content to base64
              content = btoa(String.fromCharCode(...new Uint8Array(exportResponse.data)));
              downloadedMimeType = exportMimeType;
            }
          } else {
            // Regular file download
            const response = await drive.files.get({
              fileId: fileId,
              alt: 'media'
            }, { responseType: 'arraybuffer' });
            
            console.log('File download response:', {
              status: response.status,
              contentSize: response.data.byteLength
            });
            
            // Convert the file content to base64
            content = btoa(String.fromCharCode(...new Uint8Array(response.data)));
          }
          
          result = {
            id: fileId,
            name: fileMetadata.data.name,
            mimeType: downloadedMimeType,
            originalMimeType: mimeType,
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
