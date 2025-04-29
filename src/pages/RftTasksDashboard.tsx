
import React, { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';
import Layout from '../components/layout/Layout';
import { FileUploader } from '../components/FileUploader';
import { Button } from '@/components/ui/button';
import { fetchJson } from '@/utils/api';
import { Loader, FileText, Upload, Download, File } from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { GoogleDriveFile } from '@/services/googleDriveService';
import GoogleDrivePicker from '@/components/GoogleDrivePicker';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface GenerateResponse {
  taskId: string;
  status: string;
}

const RftTasksDashboard = () => {
  const { storeId, status, error } = useAppStore();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);
  const [selectedFile, setSelectedFile] = useState<GoogleDriveFile | null>(null);
  const [selectedOutputFolder, setSelectedOutputFolder] = useState<GoogleDriveFile | null>(null);
  const [uploadMethod, setUploadMethod] = useState<'local' | 'gdrive'>('local');

  const handleGenerate = async () => {
    if (!storeId && !selectedFile) {
      toast({
        title: 'No RFT Document Selected',
        description: 'Please upload or select an RFT document first',
        variant: 'destructive',
      });
      return;
    }

    setGenerating(true);
    try {
      const payload = {
        storeId,
        ...(selectedFile && { driveFileId: selectedFile.id }),
        ...(selectedOutputFolder && { outputFolderId: selectedOutputFolder.id }),
      };

      const result = await fetchJson<GenerateResponse>('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      toast({
        title: 'Generation Started',
        description: `Task ID: ${result.taskId} is now ${result.status}`,
      });
    } catch (err: any) {
      toast({
        title: 'Generation Failed',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  const handleFileSelect = (file: GoogleDriveFile) => {
    setSelectedFile(file);
    toast({
      title: 'RFT Document Selected',
      description: `${file.name} selected from Google Drive`,
    });
  };

  const handleFolderSelect = (folder: GoogleDriveFile) => {
    setSelectedOutputFolder(folder);
    toast({
      title: 'Output Folder Selected',
      description: `${folder.name} selected for output documents`,
    });
  };

  const documentSelected = status === 'uploaded' || selectedFile !== null;

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">RFT Tasks</h2>
          <Button
            onClick={handleGenerate}
            disabled={!documentSelected || generating}
            className="flex items-center gap-2"
          >
            {generating && <Loader className="animate-spin h-4 w-4" />}
            Generate Response
          </Button>
        </div>

        <div className="bg-card rounded-lg shadow-sm border">
          <CardHeader>
            <CardTitle>New RFT Task</CardTitle>
            <CardDescription>Upload an RFT document or select one from Google Drive</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Tabs defaultValue="local" onValueChange={(v) => setUploadMethod(v as 'local' | 'gdrive')}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="local">Upload Local File</TabsTrigger>
                <TabsTrigger value="gdrive">Select from Google Drive</TabsTrigger>
              </TabsList>
              
              <TabsContent value="local" className="p-4 border rounded-md mt-4">
                <FileUploader
                  onUploaded={(id) => {
                    toast({
                      title: 'Upload Successful',
                      description: `RFT uploaded with ID: ${id}`,
                    });
                  }}
                />
              </TabsContent>
              
              <TabsContent value="gdrive" className="p-4 border rounded-md mt-4">
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-4">
                    <GoogleDrivePicker
                      onSelect={handleFileSelect}
                      onlyFiles={true}
                      allowedMimeTypes={['application/pdf', 'application/vnd.google-apps.document']}
                      trigger={<Button variant="outline"><FileText className="mr-2 h-4 w-4" /> Select RFT Document</Button>}
                      title="Select an RFT Document"
                      description="Choose a PDF or Google Doc containing the RFT"
                    />
                    
                    {selectedFile && (
                      <Alert className="mt-4">
                        <FileText className="h-5 w-5 text-blue-500" />
                        <AlertTitle>Selected RFT Document</AlertTitle>
                        <AlertDescription className="mt-1">
                          <strong>{selectedFile.name}</strong> 
                          {selectedFile.mimeType && <span className="text-sm text-muted-foreground ml-2">({selectedFile.mimeType.split('/').pop()})</span>}
                        </AlertDescription>
                      </Alert>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 border-t">
              <h3 className="text-md font-medium mb-3">Output Options</h3>
              <div className="flex flex-wrap gap-4">
                <GoogleDrivePicker
                  onSelect={handleFolderSelect}
                  onlyFolders={true}
                  trigger={<Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> {selectedOutputFolder ? "Change Output Folder" : "Select Output Folder"}</Button>}
                  title="Select Output Folder"
                  description="Choose a folder where the RFT response will be saved"
                />
                
                {selectedOutputFolder && (
                  <div className="text-sm text-muted-foreground">
                    Output will be saved to: <strong>{selectedOutputFolder.name}</strong>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              onClick={handleGenerate}
              disabled={!documentSelected || generating}
              className="w-full flex items-center justify-center gap-2"
            >
              {generating && <Loader className="animate-spin h-4 w-4" />}
              Process RFT and Generate Response
            </Button>
          </CardFooter>
        </div>

        {status === 'uploaded' && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-900/30">
            <p className="text-green-700 dark:text-green-300">
              Local RFT Document ready for processing (ID: {storeId})
            </p>
          </div>
        )}

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>
          <p className="text-muted-foreground">No recent tasks found.</p>
        </div>
      </div>
    </Layout>
  );
};

export default RftTasksDashboard;
