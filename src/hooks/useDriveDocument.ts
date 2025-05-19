import { useCallback, useEffect, useState } from 'react';
import { googleDriveService, GoogleDriveFile } from '@/services/googleDriveService';

export interface DriveDocument extends GoogleDriveFile {
  content?: string;
  webViewLink?: string;
}

export function useDriveDocument(id?: string) {
  const [loading, setLoading] = useState(false);
  const [fileData, setFileData] = useState<DriveDocument | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchDocument = useCallback(async (fileId: string) => {
    setLoading(true);
    setError(null);
    try {
      const metadata = await googleDriveService.getFileMetadata(fileId);
      try {
        const withContent = await googleDriveService.downloadFile(fileId);
        setFileData(withContent);
      } catch {
        setFileData(metadata);
        throw new Error('Content preview unavailable');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch document');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchDocument(id).catch(() => undefined);
    }
  }, [id, fetchDocument]);

  return { loading, fileData, error, fetchDocument };
}
