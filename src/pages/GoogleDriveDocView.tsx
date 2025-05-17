
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, ExternalLink, FileText, Loader, Wand2 } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { googleDriveService } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { vertexAiService, TenderAnalysis } from '@/services/vertexAiService';

const GoogleDriveDocView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [fileData, setFileData] = useState<{
    id: string;
    name: string;
    mimeType: string;
    originalMimeType?: string;
    content?: string;
    webViewLink?: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<TenderAnalysis | null>(null);

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
          // For all files, try to download/export
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
    if (!fileData?.content) {
      return (
        <div className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Content preview not available. Use the "Open in Google Drive" button to view this file.</p>
        </div>
      );
    }
    
    // Handle Google Doc exported as text/plain
    if (fileData.mimeType === 'text/plain') {
      try {
        const decodedContent = atob(fileData.content);
        return (
          <div className="p-4 bg-spotify-darkgray rounded border border-spotify-gray overflow-auto max-h-[500px]">
            <pre className="whitespace-pre-wrap text-sm">{decodedContent}</pre>
          </div>
        );
      } catch (e) {
        return renderFallbackContent();
      }
    }
    
    // Handle different file types
    if (fileData.mimeType.includes('application/pdf')) {
      try {
        const pdfData = `data:${fileData.mimeType};base64,${fileData.content}`;
        return (
          <div className="p-4 bg-spotify-darkgray rounded border border-spotify-gray overflow-auto h-[500px]">
            <iframe 
              src={pdfData} 
              className="w-full h-full" 
              title={fileData.name}
            />
          </div>
        );
      } catch (e) {
        return renderFallbackContent();
      }
    }
    
    // For Excel/Spreadsheet files
    if (fileData.mimeType.includes('spreadsheet') || 
        fileData.mimeType.includes('excel') || 
        fileData.mimeType.includes('sheet') ||
        fileData.mimeType.includes('csv')) {
      
      // If it's CSV, we can display it
      if (fileData.mimeType.includes('csv') || fileData.mimeType === 'text/csv') {
        try {
          const decodedContent = atob(fileData.content);
          return (
            <div className="p-4 bg-spotify-darkgray rounded border border-spotify-gray overflow-auto max-h-[500px]">
              <pre className="whitespace-pre-wrap text-sm font-mono">{decodedContent}</pre>
            </div>
          );
        } catch (e) {
          return renderFallbackContent();
        }
      }
      
      return renderFallbackContent("Spreadsheet");
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
      return renderFallbackContent();
    }
  };

  const renderFallbackContent = (fileType = "File") => (
    <div className="p-8 text-center">
      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p>{fileType} preview not available directly. Use the "Open in Google Drive" button to view this file.</p>
    </div>
  );

  const getFileTypeInfo = () => {
    if (!fileData) return "";
    
    if (fileData.originalMimeType && fileData.originalMimeType !== fileData.mimeType) {
      return `${getReadableFileType(fileData.originalMimeType)} (exported as ${getReadableFileType(fileData.mimeType)})`;
    }
    
    return getReadableFileType(fileData.mimeType);
  };

  const getReadableFileType = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.document') return 'Google Doc';
    if (mimeType === 'application/vnd.google-apps.spreadsheet') return 'Google Sheet';
    if (mimeType === 'application/vnd.google-apps.presentation') return 'Google Slides';
    if (mimeType === 'application/vnd.google-apps.folder') return 'Google Drive Folder';
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType === 'text/plain') return 'Text';
    if (mimeType === 'text/csv') return 'CSV';
    
    // For generic types, just show the second part
    return mimeType.split('/').pop()?.toUpperCase() || mimeType;
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
              <CardDescription className="flex items-center gap-2">
                {getFileTypeInfo()}
                {fileData.originalMimeType && (
                  <Badge variant="outline" className="ml-2">
                    {getReadableFileType(fileData.originalMimeType)}
                  </Badge>
                )}
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
                {fileData.content && (
                  <Button
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={async () => {
                      if (!fileData.content) return;
                      try {
                        setAnalyzing(true);
                        setAnalysis(null);
                        const text = atob(fileData.content);
                        const result = await vertexAiService.analyzeTender(text);
                        setAnalysis(result);
                        toast({
                          title: 'Analysis complete',
                          description: 'Tender review generated'
                        });
                      } catch (err: any) {
                        console.error('Analysis error:', err);
                        toast({
                          title: 'Analysis failed',
                          description: err.message || 'Unable to analyse document',
                          variant: 'destructive'
                        });
                      } finally {
                        setAnalyzing(false);
                      }
                    }}
                    disabled={analyzing}
                  >
                    <Wand2 className="h-4 w-4" />
                    {analyzing ? 'Analysing...' : 'Analyse'}
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
          {analysis && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>Tender Analysis</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Summary</h3>
                  <p className="text-sm mt-1">{analysis.summary}</p>
                </div>
                <div>
                  <h3 className="font-medium">Legal Requirements</h3>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {analysis.legalRequirements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Operational Needs</h3>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {analysis.operationalNeeds.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Estimation Considerations</h3>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {analysis.estimationConsiderations.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Key Criteria</h3>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {analysis.keyCriteria.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Win Themes</h3>
                  <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                    {analysis.winThemes.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          )}
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
