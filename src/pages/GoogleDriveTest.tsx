
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, AlertCircle, Loader, File, Folder, Upload, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import GoogleDriveBrowser from '@/components/GoogleDriveBrowser';
import GoogleDrivePicker from '@/components/GoogleDrivePicker';
import { GoogleDriveFile, googleDriveService } from '@/services/googleDriveService';

const GoogleDriveTest = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<GoogleDriveFile | null>(null);
  const [selectedFolder, setSelectedFolder] = useState<GoogleDriveFile | null>(null);
  const [docCreationStatus, setDocCreationStatus] = useState<{ success: boolean; data?: any; error?: string } | null>(null);
  const { toast } = useToast();

  const testGoogleDriveConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('Testing Google Drive connection...');
      const { data, error } = await supabase.functions.invoke('test-google-drive');
      
      if (error) {
        console.error('Supabase function error:', error);
        throw error;
      }
      
      console.log('Test result:', data);
      setResult(data);
      toast({
        title: 'Test Complete',
        description: data.success ? 'Service key verification successful' : 'Service key verification failed',
      });
    } catch (err: any) {
      console.error('Error testing Google Drive service role key:', err);
      setError(err.message || 'An unknown error occurred');
      toast({
        title: 'Test Failed',
        description: err.message || 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (file: GoogleDriveFile) => {
    setSelectedFile(file);
    toast({
      title: 'File Selected',
      description: `${file.name} (${file.mimeType})`,
    });
  };

  const handleFolderSelect = (folder: GoogleDriveFile) => {
    setSelectedFolder(folder);
    toast({
      title: 'Folder Selected',
      description: folder.name,
    });
  };

  const createNewGoogleDoc = async () => {
    if (!selectedFolder) {
      toast({
        title: 'No folder selected',
        description: 'Please select a folder first',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setDocCreationStatus(null);

    try {
      const docName = `Test Document ${new Date().toLocaleString()}`;
      const result = await googleDriveService.createGoogleDoc(docName, selectedFolder.id);
      
      setDocCreationStatus({
        success: true,
        data: result
      });
      
      toast({
        title: 'Google Doc Created',
        description: `"${result.name}" created successfully`,
      });
    } catch (err: any) {
      console.error('Error creating Google Doc:', err);
      setDocCreationStatus({
        success: false,
        error: err.message || 'Failed to create Google Doc'
      });
      
      toast({
        title: 'Error',
        description: err.message || 'Failed to create Google Doc',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Google Drive Integration</h2>
        </div>
        
        <Tabs defaultValue="connection">
          <TabsList>
            <TabsTrigger value="connection">Connection Test</TabsTrigger>
            <TabsTrigger value="browser">File Browser</TabsTrigger>
            <TabsTrigger value="picker">File Picker</TabsTrigger>
            <TabsTrigger value="output">Output Testing</TabsTrigger>
          </TabsList>
          
          <TabsContent value="connection" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Verify Google Drive Service Role Key</CardTitle>
                <CardDescription>
                  Test if the Google Drive service role key is properly configured
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={testGoogleDriveConnection} 
                  disabled={loading}
                  className="flex gap-2 items-center"
                >
                  {loading && <Loader size={16} className="animate-spin" />}
                  Test Connection
                </Button>
                
                {result && (
                  <Alert variant={result.success ? "default" : "destructive"}>
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <AlertCircle className="h-5 w-5" />
                      )}
                      <AlertTitle>
                        {result.success ? "Service Key Found" : "Service Key Error"}
                      </AlertTitle>
                    </div>
                    <AlertDescription className="mt-2">
                      {result.success ? (
                        <div className="space-y-2">
                          <p>Service key was successfully loaded from environment variables.</p>
                          <ul className="list-disc pl-5 text-sm">
                            <li>Key length: {result.keyInfo.keyLength} characters</li>
                            <li>Key prefix: {result.keyInfo.keyPrefix}</li>
                            {result.tokenParts && <li>Token parts: {result.tokenParts} (JWT format)</li>}
                          </ul>
                        </div>
                      ) : (
                        <p>{result.error || "Unknown error occurred"}</p>
                      )}
                    </AlertDescription>
                  </Alert>
                )}
                
                {error && !result && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-5 w-5" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="browser" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Google Drive Browser</CardTitle>
                <CardDescription>Browse files and folders in your Google Drive</CardDescription>
              </CardHeader>
              <CardContent>
                <GoogleDriveBrowser 
                  initialFolderId="1ULtJBBqNdJXHadeW0RfBpvYqRvV2VOTi"
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="picker" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>File & Folder Selection</CardTitle>
                <CardDescription>Test selecting files and folders from Google Drive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Select a File</h3>
                  <div className="flex flex-wrap gap-4">
                    <GoogleDrivePicker
                      onSelect={handleFileSelect}
                      onlyFiles={true}
                      allowedMimeTypes={['application/pdf', 'application/vnd.google-apps.document']}
                      trigger={<Button variant="outline"><File className="mr-2 h-4 w-4" /> Select File</Button>}
                      title="Select an RFT Document"
                      description="Choose a PDF or Google Doc"
                    />
                    
                    {selectedFile && (
                      <Alert className="mt-4">
                        <div className="flex items-start gap-2">
                          <File className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <AlertTitle>Selected File</AlertTitle>
                            <AlertDescription>
                              <div className="space-y-1 mt-1">
                                <p><strong>Name:</strong> {selectedFile.name}</p>
                                <p><strong>Type:</strong> {selectedFile.mimeType}</p>
                                {selectedFile.webViewLink && (
                                  <p>
                                    <a 
                                      href={selectedFile.webViewLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 hover:underline"
                                    >
                                      Open in Google Drive
                                    </a>
                                  </p>
                                )}
                              </div>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Select a Folder</h3>
                  <div className="flex flex-wrap gap-4">
                    <GoogleDrivePicker
                      onSelect={handleFolderSelect}
                      onlyFolders={true}
                      trigger={<Button variant="outline"><Folder className="mr-2 h-4 w-4" /> Select Folder</Button>}
                      title="Select Output Folder"
                      description="Choose a folder for storing output documents"
                    />
                    
                    {selectedFolder && (
                      <Alert className="mt-4">
                        <div className="flex items-start gap-2">
                          <Folder className="h-5 w-5 text-blue-500 mt-0.5" />
                          <div>
                            <AlertTitle>Selected Folder</AlertTitle>
                            <AlertDescription>
                              <p className="mt-1"><strong>Name:</strong> {selectedFolder.name}</p>
                            </AlertDescription>
                          </div>
                        </div>
                      </Alert>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="output" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Google Docs Output</CardTitle>
                <CardDescription>Test creating new Google Docs in selected folders</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium">Create a Test Document</h3>
                    
                    {!selectedFolder && (
                      <GoogleDrivePicker
                        onSelect={handleFolderSelect}
                        onlyFolders={true}
                        trigger={<Button variant="outline" size="sm"><Folder className="mr-2 h-4 w-4" />Select Folder First</Button>}
                        title="Select Output Folder"
                        description="Choose a folder for storing the new Google Doc"
                      />
                    )}
                  </div>
                  
                  {selectedFolder && (
                    <Alert>
                      <Folder className="h-5 w-5 text-blue-500" />
                      <AlertTitle>Output Folder Selected</AlertTitle>
                      <AlertDescription>
                        New document will be created in: <strong>{selectedFolder.name}</strong>
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button 
                    onClick={createNewGoogleDoc} 
                    disabled={loading || !selectedFolder}
                    className="flex gap-2 items-center"
                  >
                    {loading && <Loader size={16} className="animate-spin" />}
                    <Upload className="mr-2 h-4 w-4" />
                    Create Test Google Doc
                  </Button>
                  
                  {docCreationStatus && (
                    <Alert variant={docCreationStatus.success ? "default" : "destructive"}>
                      <div className="flex items-center gap-2">
                        {docCreationStatus.success ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <AlertCircle className="h-5 w-5" />
                        )}
                        <AlertTitle>
                          {docCreationStatus.success ? "Document Created" : "Creation Failed"}
                        </AlertTitle>
                      </div>
                      <AlertDescription className="mt-2">
                        {docCreationStatus.success ? (
                          <div className="space-y-2">
                            <p>Google Doc was successfully created.</p>
                            {docCreationStatus.data?.webViewLink && (
                              <a 
                                href={docCreationStatus.data.webViewLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center"
                              >
                                Open in Google Drive <Download className="ml-1 h-4 w-4" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <p>{docCreationStatus.error || "Unknown error occurred"}</p>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default GoogleDriveTest;
