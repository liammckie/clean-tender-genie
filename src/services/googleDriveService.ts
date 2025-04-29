
import { supabase } from '@/integrations/supabase/client';

type GoogleDriveFile = {
  id: string;
  name: string;
  mimeType: string;
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
      const { data, error } = await supabase.functions.invoke('google-drive', {
        body: {
          action: 'listFiles',
          folderId
        }
      });

      if (error) {
        console.error('Error from Supabase Function:', error);
        throw new Error(error.message || 'Failed to list files from Google Drive');
      }

      console.log('Response from Google Drive function:', data);
      
      // Ensure we have a valid response with files array
      if (!data || !data.files) {
        console.warn('Invalid response structure from Google Drive function:', data);
        return {
          files: [],
          currentFolderId: folderId || ''
        };
      }

      return {
        files: Array.isArray(data.files) ? data.files : [],
        currentFolderId: data.currentFolderId || folderId || ''
      };
    } catch (err) {
      console.error('Exception in listFiles:', err);
      throw err;
    }
  },

  async getFileMetadata(fileId: string): Promise<GoogleDriveFile> {
    console.log('Getting file metadata for:', fileId);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-drive', {
        body: {
          action: 'getFileMetadata',
          fileId
        }
      });

      if (error) {
        console.error('Error getting file metadata from Google Drive:', error);
        throw new Error(error.message || 'Failed to get file metadata from Google Drive');
      }

      console.log('File metadata response:', data);
      return data;
    } catch (err) {
      console.error('Exception in getFileMetadata:', err);
      throw err;
    }
  },

  async downloadFile(fileId: string): Promise<{
    id: string;
    name: string;
    mimeType: string;
    content: string;
  }> {
    console.log('Downloading file:', fileId);
    
    try {
      const { data, error } = await supabase.functions.invoke('google-drive', {
        body: {
          action: 'downloadFile',
          fileId
        }
      });

      if (error) {
        console.error('Error downloading file from Google Drive:', error);
        throw new Error(error.message || 'Failed to download file from Google Drive');
      }

      console.log('File download response received, content size:', data?.content?.length);
      return data;
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
      const { data, error } = await supabase.functions.invoke('google-drive', {
        body: {
          action: 'createGoogleDoc',
          fileName,
          folderId
        }
      });

      if (error) {
        console.error('Error creating Google Doc:', error);
        throw new Error(error.message || 'Failed to create Google Doc');
      }

      console.log('Google Doc created:', data);
      return data;
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
      const { data, error } = await supabase.functions.invoke('google-drive', {
        body: {
          action: 'updateGoogleDoc',
          fileId,
          content
        }
      });

      if (error) {
        console.error('Error updating Google Doc:', error);
        throw new Error(error.message || 'Failed to update Google Doc');
      }

      console.log('Google Doc updated:', data);
      return data;
    } catch (err) {
      console.error('Exception in updateGoogleDoc:', err);
      throw err;
    }
  }
};

export type { GoogleDriveFile };
