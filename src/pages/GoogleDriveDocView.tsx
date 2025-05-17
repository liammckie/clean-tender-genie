
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileText, Loader } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { googleDriveService } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';

const GoogleDriveDocView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState<{
    id: string;
    name: string;
    mimeType: string;
    content?: string;
    webViewLink?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocument() {
      if (!id) return;
      
      setLoading(true);
      setError(null);
      
      try {
        // First get the metadata
        const metadata = await googleDriveService.getFileMetadata(id);
        console.log('File metadata:', metadata);
        
        // Then download the content if it's a supported type
        if (metadata) {
          const isSupportedType = metadata.mimeType.includes('text') || 
                                  metadata.mimeType.includes('document') ||
                                  metadata.mimeType.includes('application/pdf');
          
          if (isSupportedType) {
            try {
              const fileWithContent = await googleDriveService.downloadFile(id);
              setFileData(fileWithContent);
            } catch (contentError) {
              console.error('Error downloading file content:', contentError);
              // Still set the metadata even if content download fails
              setFileData(metadata);
              toast({
                title: 'Content preview unavailable',
                description: 'Only metadata could be retrieved for this file',
                variant: 'destructive',
              });
            }
          } else {
            // Just use metadata for non-supported files
            setFileData(metadata);
          }
        }
      } catch (err: any) {
        console.error('Error fetching document:', err);
        setError(err.message || 'Failed to fetch document');
        toast({
          title: 'Error',
          description: err.message || 'Failed to fetch document',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    }

    fetchDocument();
  }, [id, toast]);

  const renderContent = () => {
    if (!fileData?.content) return null;
    
    // Handle different file types
    if (fileData.mimeType.includes('application/pdf')) {
      // For PDF, we can only show a link to view it
      return (
        <div className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>PDF preview not available directly. Use the "Open in Google Drive" button to view this file.</p>
        </div>
      );
    }
    
    // For text content, decode and display
    try {
      const decodedContent = atob(fileData.content);
      return (
        <div className="p-4 bg-spotify-darkgray rounded border border-spotify-gray overflow-auto max-h-[500px]">
          <pre className="whitespace-pre-wrap text-sm">{decodedContent}</pre>
        </div>
      );
    } catch (e) {
      return (
        <div className="p-4 text-center">
          <p>Content cannot be displayed in this view.</p>
        </div>
      );
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Google Drive Document</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Loader className="h-10 w-10 animate-spin opacity-30 mb-4" />
              <p>Loading document...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : fileData ? (
          <Card>
            <CardHeader>
              <CardTitle>{fileData.name}</CardTitle>
              <CardDescription>
                {fileData.mimeType}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {renderContent()}
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {/* You could add additional actions here */}
              </div>
              <div className="flex gap-2">
                {fileData.webViewLink && (
                  <Button 
                    variant="outline"
                    className="flex items-center gap-2"
                    asChild
                  >
                    <a 
                      href={fileData.webViewLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Open in Google Drive
                    </a>
                  </Button>
                )}
                {fileData.content && (
                  <Button 
                    className="flex items-center gap-2"
                    onClick={() => {
                      try {
                        const decodedContent = atob(fileData.content || '');
                        const blob = new Blob([decodedContent], { type: fileData.mimeType });
                        const url = URL.createObjectURL(blob);
                        
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = fileData.name;
                        a.click();
                        
                        URL.revokeObjectURL(url);
                        
                        toast({
                          title: 'Success',
                          description: 'File downloaded successfully',
                        });
                      } catch (err) {
                        console.error('Download error:', err);
                        toast({
                          title: 'Download failed',
                          description: 'Unable to download file',
                          variant: 'destructive',
                        });
                      }
                    }}
                  >
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p>No document found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default GoogleDriveDocView;
