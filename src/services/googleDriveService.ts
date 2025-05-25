
import { supabase } from '@/integrations/supabase/client';
import { handleSupabaseResponse } from './supabaseHelpers';

export enum GoogleDriveAction {
  ListFiles = 'listFiles',
  GetFileMetadata = 'getFileMetadata',
  DownloadFile = 'downloadFile',
  CreateGoogleDoc = 'createGoogleDoc',
  UpdateGoogleDoc = 'updateGoogleDoc',
}

export type GoogleDriveFile = {
  id: string;
  name: string;
  mimeType: string;
  originalMimeType?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  webViewLink?: string;
};

export type ListFilesResponse = {
  files: GoogleDriveFile[];
  currentFolderId: string;
};

export const googleDriveService = {
  async listFiles(folderId?: string): Promise<ListFilesResponse> {
    const response = await supabase.functions.invoke('google-drive', {
      body: { action: GoogleDriveAction.ListFiles, folderId },
    });
    const data = handleSupabaseResponse<ListFilesResponse>(
      response,
      'Failed to list files from Google Drive',
    );
    return {
      files: Array.isArray(data.files) ? data.files : [],
      currentFolderId: data.currentFolderId || folderId || '',
    };
  },

  async getFileMetadata(fileId: string): Promise<GoogleDriveFile> {
    const response = await supabase.functions.invoke('google-drive', {
      body: { action: GoogleDriveAction.GetFileMetadata, fileId },
    });
    return handleSupabaseResponse<GoogleDriveFile>(
      response,
      'Failed to get file metadata from Google Drive',
    );
  },

  async downloadFile(fileId: string): Promise<GoogleDriveFile & { content: string }> {
    const response = await supabase.functions.invoke('google-drive', {
      body: { action: GoogleDriveAction.DownloadFile, fileId },
    });
    return handleSupabaseResponse<GoogleDriveFile & { content: string }>(
      response,
      'Failed to download file from Google Drive',
    );
  },

  async createGoogleDoc(fileName: string, folderId?: string): Promise<{
    id: string;
    name: string;
    webViewLink?: string;
  }> {
    const response = await supabase.functions.invoke('google-drive', {
      body: { action: GoogleDriveAction.CreateGoogleDoc, fileName, folderId },
    });
    return handleSupabaseResponse<{ id: string; name: string; webViewLink?: string }>(
      response,
      'Failed to create Google Doc',
    );
  },

  async updateGoogleDoc(fileId: string, content: string): Promise<{
    id: string;
    name: string;
    webViewLink?: string;
  }> {
    const response = await supabase.functions.invoke('google-drive', {
      body: { action: GoogleDriveAction.UpdateGoogleDoc, fileId, content },
    });
    return handleSupabaseResponse<{ id: string; name: string; webViewLink?: string }>(
      response,
      'Failed to update Google Doc',
    );
  },
};
