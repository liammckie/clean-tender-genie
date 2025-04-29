
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
    const { data, error } = await supabase.functions.invoke('google-drive', {
      body: {
        action: 'listFiles',
        folderId
      }
    });

    if (error) {
      console.error('Error listing files from Google Drive:', error);
      throw new Error(error.message || 'Failed to list files from Google Drive');
    }

    return data;
  },

  async getFileMetadata(fileId: string): Promise<GoogleDriveFile> {
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

    return data;
  },

  async downloadFile(fileId: string): Promise<{
    id: string;
    name: string;
    mimeType: string;
    content: string;
  }> {
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

    return data;
  },

  async createGoogleDoc(fileName: string, folderId?: string): Promise<{
    id: string;
    name: string;
    webViewLink?: string;
  }> {
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

    return data;
  },

  async updateGoogleDoc(fileId: string, content: string): Promise<{
    id: string;
    name: string;
    webViewLink?: string;
  }> {
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

    return data;
  }
};

export type { GoogleDriveFile };
