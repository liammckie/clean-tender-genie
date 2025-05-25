import { useState, useEffect } from 'react';
import { Folder, File, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { googleDriveService, GoogleDriveFile } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';

interface GoogleDriveBrowserProps {
  onFileSelect?: (file: GoogleDriveFile) => void;
  onFolderSelect?: (folder: GoogleDriveFile) => void;
  selectionMode?: 'files' | 'folders' | 'both';
  allowedMimeTypes?: string[];
  initialFolderId?: string;
  onlyFiles?: boolean;
  onlyFolders?: boolean;
}

const GoogleDriveBrowser = ({ 
  onFileSelect, 
  onFolderSelect, 
  selectionMode = 'both',
  allowedMimeTypes = [],
  initialFolderId,
  onlyFiles = false,
  onlyFolders = false
}: GoogleDriveBrowserProps) => {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string>(initialFolderId || '');
  const [folderHistory, setFolderHistory] = useState<Array<{id: string, name: string}>>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadFiles = async (folderId?: string) => {
    setLoading(true);
    setError(null);
    try {
      const result = await googleDriveService.listFiles(folderId);
      setFiles(result.files);
      setCurrentFolderId(result.currentFolderId);
    } catch (error: any) {
      const errorMessage = error.message || 'Failed to load Google Drive files';
      setError(errorMessage);
      toast({
        title: 'Error loading files',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles(initialFolderId);
  }, [initialFolderId]);

  const handleFolderClick = (folder: GoogleDriveFile) => {
    setFolderHistory(prev => [...prev, { id: currentFolderId, name: 'Previous' }]);
    loadFiles(folder.id);
  };

  const handleBackClick = () => {
    const previous = folderHistory[folderHistory.length - 1];
    if (previous) {
      setFolderHistory(prev => prev.slice(0, -1));
      loadFiles(previous.id || undefined);
    }
  };

  const handleItemSelect = (item: GoogleDriveFile) => {
    const isFolder = item.mimeType === 'application/vnd.google-apps.folder';
    
    if (isFolder) {
      if (onlyFolders || selectionMode === 'folders' || selectionMode === 'both') {
        onFolderSelect?.(item);
      } else {
        handleFolderClick(item);
      }
    } else {
      if (onlyFiles || selectionMode === 'files' || selectionMode === 'both') {
        if (allowedMimeTypes.length === 0 || allowedMimeTypes.includes(item.mimeType)) {
          onFileSelect?.(item);
        } else {
          toast({
            title: 'File type not allowed',
            description: `Only ${allowedMimeTypes.join(', ')} files are allowed`,
            variant: 'destructive',
          });
        }
      }
    }
  };

  const handleRetry = () => {
    loadFiles(currentFolderId);
  };

  const isFolder = (mimeType: string) => mimeType === 'application/vnd.google-apps.folder';

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleRetry}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Google Drive Browser</CardTitle>
            <CardDescription>Select files from your Google Drive</CardDescription>
          </div>
          {folderHistory.length > 0 && (
            <Button variant="outline" onClick={handleBackClick}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : files.length === 0 ? (
          <div className="text-center py-8">No files found in this folder</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file) => (
              <Card 
                key={file.id} 
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleItemSelect(file)}
              >
                <CardContent className="p-4 flex items-center space-x-3">
                  {isFolder(file.mimeType) ? (
                    <Folder className="w-8 h-8 text-blue-500" />
                  ) : (
                    <File className="w-8 h-8 text-gray-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {isFolder(file.mimeType) ? 'Folder' : file.mimeType.split('/').pop()}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GoogleDriveBrowser;
