
import { supabase } from '@/integrations/supabase/client';

export enum GoogleDriveAction {
  ListFiles = 'listFiles',
  GetFileMetadata = 'getFileMetadata',
  DownloadFile = 'downloadFile',
  CreateGoogleDoc = 'createGoogleDoc',
  UpdateGoogleDoc = 'updateGoogleDoc',
}

type GoogleDriveFile = {
  id: string;
  name: string;
  mimeType: string;
  originalMimeType?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
};

type ListFilesResponse = {
  files: GoogleDriveFile[];
  currentFolderId: string;
};

export const googleDriveService = {
  async listFiles(folderId?: string): Promise<ListFilesResponse> {
    console.log('Calling listFiles with folderId:', folderId);
    
    try {
      const response = await supabase.functions.invoke('google-drive', {
        body: {
          action: GoogleDriveAction.ListFiles,
          folderId
        }
      });

      console.log('Raw response from Google Drive function:', response);
      
      if (response.error) {
        console.error('Error from Supabase Function:', response.error);
        throw new Error(response.error.message || 'Failed to list files from Google Drive');
      }
      
      // The response structure from the edge function is { data: { success: true, data: { files: [], currentFolderId: '' } } }
      // We need to extract the files and currentFolderId from this nested structure
      const data = response.data;
      
      if (!data || !data.success || !data.data) {
        console.warn('Invalid response structure from Google Drive function:', data);
        return {
          files: [],
          currentFolderId: folderId || ''
        };
      }

      const filesData = data.data;
      console.log('Extracted files data:', filesData);

      return {
        files: Array.isArray(filesData.files) ? filesData.files : [],
        currentFolderId: filesData.currentFolderId || folderId || ''
      };
    } catch (err) {
      console.error('Exception in listFiles:', err);
      throw err;
    }
  },

  async getFileMetadata(fileId: string): Promise<GoogleDriveFile> {
    console.log('Getting file metadata for:', fileId);
    
    try {
      const response = await supabase.functions.invoke('google-drive', {
        body: {
          action: GoogleDriveAction.GetFileMetadata,
          fileId
        }
      });

      console.log('Raw file metadata response:', response);
      
      if (response.error) {
        console.error('Error getting file metadata from Google Drive:', response.error);
        throw new Error(response.error.message || 'Failed to get file metadata from Google Drive');
      }

      // Extract the file metadata from the nested structure
      const data = response.data;
      
      if (!data || !data.success || !data.data) {
        console.warn('Invalid response structure for file metadata:', data);
        throw new Error('Invalid file metadata response structure');
      }
      
      return data.data;
    } catch (err) {
      console.error('Exception in getFileMetadata:', err);
      throw err;
    }
  },

  async downloadFile(fileId: string): Promise<{
    id: string;
    name: string;
    mimeType: string;
    originalMimeType?: string;
    content: string;
  }> {
    console.log('Downloading file:', fileId);
    
    try {
      const response = await supabase.functions.invoke('google-drive', {
        body: {
          action: GoogleDriveAction.DownloadFile,
          fileId
        }
      });

      console.log('Raw file download response:', response);
      
      if (response.error) {
        console.error('Error downloading file from Google Drive:', response.error);
        throw new Error(response.error.message || 'Failed to download file from Google Drive');
      }

      // Extract the file data from the nested structure
      const data = response.data;
      
      if (!data || !data.success || !data.data) {
        console.warn('Invalid response structure for file download:', data);
        throw new Error('Invalid file download response structure');
      }

      console.log('File download response extracted, content size:', data.data?.content?.length);
      return data.data;
    } catch (err) {
      console.error('Exception in downloadFile:', err);
      throw err;
    }
  },

  async createGoogleDoc(fileName: string, folderId?: string): Promise<{
    id: string;
    name: string;
    webViewLink?: string;
  }> {
    console.log('Creating Google Doc:', fileName, 'in folder:', folderId || 'default');
    
    try {
      const response = await supabase.functions.invoke('google-drive', {
        body: {
          action: GoogleDriveAction.CreateGoogleDoc,
          fileName,
          folderId
        }
      });

      console.log('Raw Google Doc creation response:', response);
      
      if (response.error) {
        console.error('Error creating Google Doc:', response.error);
        throw new Error(response.error.message || 'Failed to create Google Doc');
      }

      // Extract the created document data from the nested structure
      const data = response.data;
      
      if (!data || !data.success || !data.data) {
        console.warn('Invalid response structure for Google Doc creation:', data);
        throw new Error('Invalid Google Doc creation response structure');
      }

      console.log('Google Doc created:', data.data);
      return data.data;
    } catch (err) {
      console.error('Exception in createGoogleDoc:', err);
      throw err;
    }
  },

  async updateGoogleDoc(fileId: string, content: string): Promise<{
    id: string;
    name: string;
    webViewLink?: string;
  }> {
    console.log('Updating Google Doc:', fileId);
    
    try {
      const response = await supabase.functions.invoke('google-drive', {
        body: {
          action: GoogleDriveAction.UpdateGoogleDoc,
          fileId,
          content
        }
      });

      console.log('Raw Google Doc update response:', response);
      
      if (response.error) {
        console.error('Error updating Google Doc:', response.error);
        throw new Error(response.error.message || 'Failed to update Google Doc');
      }

      // Extract the updated document data from the nested structure
      const data = response.data;
      
      if (!data || !data.success || !data.data) {
        console.warn('Invalid response structure for Google Doc update:', data);
        throw new Error('Invalid Google Doc update response structure');
      }

      console.log('Google Doc updated:', data.data);
      return data.data;
    } catch (err) {
      console.error('Exception in updateGoogleDoc:', err);
      throw err;
    }
  }
};

export type { GoogleDriveFile };
export { GoogleDriveAction };
