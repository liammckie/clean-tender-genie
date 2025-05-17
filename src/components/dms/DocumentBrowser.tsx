
import React, { useState, useEffect } from 'react';
import { FileText, Folder, Search, Loader, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { googleDriveService, GoogleDriveFile } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbList } from '@/components/ui/breadcrumb';

interface BreadcrumbItem {
  id: string;
  name: string;
}

const DocumentBrowser: React.FC = () => {
  const [files, setFiles] = useState<GoogleDriveFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentFolder, setCurrentFolder] = useState<string>('1ULtJBBqNdJXHadeW0RfBpvYqRvV2VOTi');
  const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([{ id: '1ULtJBBqNdJXHadeW0RfBpvYqRvV2VOTi', name: 'Root' }]);
  const { toast } = useToast();

  useEffect(() => {
    loadFiles(currentFolder);
  }, [currentFolder]);

  const loadFiles = async (folderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await googleDriveService.listFiles(folderId);
      console.log('Files loaded:', response);
      setFiles(response.files || []);
      setCurrentFolder(response.currentFolderId);
    } catch (err: any) {
      console.error('Error loading files:', err);
      setError(err.message || 'Failed to load documents');
      toast({
        title: 'Error loading documents',
        description: err.message || 'Could not retrieve documents from Google Drive',
        variant: 'destructive',
      });
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (file: GoogleDriveFile) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      // Add folder to breadcrumbs and navigate into it
      setBreadcrumbs([...breadcrumbs, { id: file.id, name: file.name }]);
      setCurrentFolder(file.id);
    }
  };

  const navigateToFolder = (index: number) => {
    const newBreadcrumbs = breadcrumbs.slice(0, index + 1);
    setBreadcrumbs(newBreadcrumbs);
    const folderId = newBreadcrumbs[index].id;
    setCurrentFolder(folderId);
  };

  const handleRetry = () => {
    loadFiles(currentFolder);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const filteredFiles = searchQuery
    ? files.filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files;

  return (
    <div className="space-y-4">
      {/* Breadcrumbs and search */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Breadcrumb className="max-w-full overflow-x-auto">
          <BreadcrumbList>
            {breadcrumbs.map((breadcrumb, index) => (
              <React.Fragment key={breadcrumb.id}>
                {index > 0 && <BreadcrumbSeparator />}
                <BreadcrumbItem>
                  <BreadcrumbLink 
                    onClick={() => navigateToFolder(index)} 
                    className="cursor-pointer truncate max-w-[100px] sm:max-w-[200px]"
                  >
                    {breadcrumb.name}
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>

        <div className="relative w-full sm:w-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-spotify-lightgray" />
          <Input 
            placeholder="Search documents..." 
            className="pl-10 bg-spotify-darkgray border-spotify-gray w-full sm:w-64"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      
      {/* Error alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription className="flex items-center justify-between">
            <span>{error}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleRetry}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Document list */}
      <div className="bg-spotify-darkgray rounded-lg border border-spotify-gray overflow-hidden">
        <div className="grid grid-cols-12 py-2 px-4 border-b border-spotify-gray text-sm font-medium text-spotify-lightgray">
          <div className="col-span-7">Name</div>
          <div className="col-span-3">Last Modified</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        <div className="divide-y divide-spotify-gray">
          {loading ? (
            // Loading skeletons
            Array(5).fill(null).map((_, index) => (
              <div key={index} className="grid grid-cols-12 py-3 px-4 items-center">
                <div className="col-span-7 flex items-center">
                  <Skeleton className="h-5 w-5 mr-3 rounded-md" />
                  <Skeleton className="h-4 w-48" />
                </div>
                <div className="col-span-3">
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="col-span-2">
                  <Skeleton className="h-8 w-16 rounded-md" />
                </div>
              </div>
            ))
          ) : filteredFiles.length === 0 ? (
            <div className="py-6 text-center text-spotify-lightgray">
              {searchQuery ? 'No documents match your search' : 'No documents found in this folder'}
            </div>
          ) : (
            filteredFiles.map((doc) => (
              <div 
                key={doc.id} 
                className="grid grid-cols-12 py-3 px-4 hover:bg-[#282828] transition-colors items-center"
              >
                <div 
                  className="col-span-7 flex items-center cursor-pointer"
                  onClick={() => handleFolderClick(doc)}
                >
                  {doc.mimeType === 'application/vnd.google-apps.folder' ? (
                    <Folder className="h-5 w-5 mr-3 text-spotify-green" />
                  ) : (
                    <FileText className="h-5 w-5 mr-3 text-spotify-lightgray" />
                  )}
                  <span className="truncate" title={doc.name}>{doc.name}</span>
                </div>
                <div className="col-span-3 text-spotify-lightgray text-sm truncate">
                  {formatDate(doc.modifiedTime)}
                </div>
                <div className="col-span-2 flex space-x-2">
                  {doc.mimeType !== 'application/vnd.google-apps.folder' ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                      asChild
                    >
                      <Link to={`/google-drive/documents/${doc.id}`}>Open</Link>
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 px-2"
                      onClick={() => handleFolderClick(doc)}
                    >
                      Open
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Refresh/reload button */}
      <div className="flex justify-end">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleRetry} 
          disabled={loading}
          className="flex items-center gap-2"
        >
          {loading && <Loader className="h-3 w-3 animate-spin" />}
          {loading ? 'Loading...' : 'Refresh'}
        </Button>
      </div>
    </div>
  );
};

export default DocumentBrowser;
