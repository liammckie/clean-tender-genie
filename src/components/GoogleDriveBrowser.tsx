
import React, { useState, useEffect } from 'react';
import { googleDriveService, GoogleDriveFile } from '@/services/googleDriveService';
import { Folder, File, ChevronRight, Download, Eye, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from '@/components/ui/breadcrumb';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface GoogleDriveBrowserProps {
  initialFolderId?: string;
  onFileSelect?: (file: GoogleDriveFile) => void;
  onFolderSelect?: (folder: GoogleDriveFile) => void;
  onlyFolders?: boolean;
  onlyFiles?: boolean;
  allowedMimeTypes?: string[];
  className?: string;
}

interface BreadcrumbItem {
  id: string;
  name: string;
}

const isFolder = (file: GoogleDriveFile) => file.mimeType === 'application/vnd.google-apps.folder';

const GoogleDriveBrowser: React.FC<GoogleDriveBrowserProps> = ({
  initialFolderId = '1ULtJBBqNdJXHadeW0RfBpvYqRvV2VOTi',
  onFileSelect,
  onFolderSelect,
  onlyFolders = false,
  onlyFiles = false,
  allowedMimeTypes,
  className
}) => {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [currentFolder, setCurrentFolder] = useState<string>(initialFolderId);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: initialFolderId, name: 'Root' }]);
  const { toast } = useToast();

  const loadFiles = async (folderId: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await googleDriveService.listFiles(folderId);
      
      // Filter files based on props
      let filteredFiles = response.files;
      
      if (onlyFolders) {
        filteredFiles = filteredFiles.filter(file => isFolder(file));
      } else if (onlyFiles) {
        filteredFiles = filteredFiles.filter(file => !isFolder(file));
      }
      
      if (allowedMimeTypes && allowedMimeTypes.length > 0) {
        filteredFiles = filteredFiles.filter(file => 
          allowedMimeTypes.some(mimeType => 
            file.mimeType === mimeType || file.mimeType.startsWith(mimeType + '.')
          ) || isFolder(file) // Always keep folders
        );
      }
      
      setFiles(filteredFiles);
      setCurrentFolder(response.currentFolderId);
    } catch (err: any) {
      console.error('Error loading files:', err);
      setError(err.message || 'Failed to load files from Google Drive');
      toast({
        title: 'Error loading files',
        description: err.message || 'Failed to load files from Google Drive',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileClick = (file: GoogleDriveFile) => {
    if (isFolder(file)) {
      setCurrentFolder(file.id);
      setBreadcrumbs([...breadcrumbs, { id: file.id, name: file.name }]);
      loadFiles(file.id);
      if (onFolderSelect) {
        onFolderSelect(file);
      }
    } else if (onFileSelect) {
      onFileSelect(file);
    }
  };

  const navigateToFolder = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    const folderId = newBreadcrumbs[index].id;
    setCurrentFolder(folderId);
    loadFiles(folderId);
  };

  const navigateUp = () => {
    if (breadcrumbs.length > 1) {
      const newBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);
      setBreadcrumbs(newBreadcrumbs);
      const folderId = newBreadcrumbs[newBreadcrumbs.length - 1].id;
      setCurrentFolder(folderId);
      loadFiles(folderId);
    }
  };

  useEffect(() => {
    loadFiles(initialFolderId);
  }, [initialFolderId]);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between">
        <Breadcrumb>
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.id}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  <BreadcrumbLink onClick={() => navigateToFolder(index)} className="cursor-pointer">
                    {breadcrumb.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        {breadcrumbs.length > 1 && (
          <Button variant="outline" size="sm" onClick={navigateUp}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Up
          </Button>
        )}
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-md text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-center space-x-2">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-[200px]" />
                      <Skeleton className="h-3 w-[150px]" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : files.length === 0 ? (
          <div className="col-span-full text-center py-8 text-gray-500">
            No files found in this folder
          </div>
        ) : (
          files.map((file) => (
            <Card 
              key={file.id} 
              className={cn(
                "cursor-pointer hover:border-primary/50 transition-colors overflow-hidden",
                !isFolder(file) && onFileSelect ? "hover:bg-muted/50" : ""
              )}
              onClick={() => handleFileClick(file)}
            >
              <CardContent className="p-0">
                <div className="p-4">
                  <div className="flex items-start">
                    <div className="mr-3 mt-1">
                      {isFolder(file) ? (
                        <Folder className="h-10 w-10 text-blue-500" />
                      ) : (
                        <File className="h-10 w-10 text-gray-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-medium truncate" title={file.name}>{file.name}</h3>
                      </div>
                      
                      <div className="mt-1 flex flex-wrap gap-1 text-xs text-muted-foreground">
                        {file.modifiedTime && (
                          <span title={new Date(file.modifiedTime).toLocaleString()}>
                            {new Date(file.modifiedTime).toLocaleDateString()}
                          </span>
                        )}
                        
                        {file.size && (
                          <>
                            <span>•</span>
                            <span>
                              {parseInt(file.size) < 1024 * 1024 
                                ? `${Math.round(parseInt(file.size) / 1024)} KB` 
                                : `${Math.round(parseInt(file.size) / 1024 / 1024 * 10) / 10} MB`}
                            </span>
                          </>
                        )}
                        
                        {!isFolder(file) && (
                          <>
                            <span>•</span>
                            <Badge variant="outline" className="h-5 px-1">
                              {file.mimeType.split('/').pop()?.toUpperCase()}
                            </Badge>
                          </>
                        )}
                      </div>
                    </div>
                    
                    {isFolder(file) ? (
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    ) : file.webViewLink ? (
                      <a 
                        href={file.webViewLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye className="h-5 w-5" />
                      </a>
                    ) : null}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default GoogleDriveBrowser;
