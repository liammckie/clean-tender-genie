
import React from 'react';
import Layout from '../components/layout/Layout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DocumentBrowser from '@/components/dms/DocumentBrowser';
import { Button } from '@/components/ui/button';
import { Plus, Upload } from 'lucide-react';
import GoogleDrivePicker from '@/components/GoogleDrivePicker';
import { GoogleDriveFile } from '@/services/googleDriveService';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const DmsHome = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleFileSelect = (file: GoogleDriveFile) => {
    toast({
      title: 'Document Selected',
      description: `Opening ${file.name}`
    });

    navigate(`/google-drive/documents/${file.id}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Document Management System</h1>
        <div className="flex gap-2">
          <GoogleDrivePicker
            onSelect={handleFileSelect}
            onlyFiles={true}
            trigger={<Button><Plus className="mr-2 h-4 w-4" />Add Document</Button>}
            title="Select a Document"
            description="Choose a document from Google Drive to add to your workspace"
          />
        </div>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all">All Documents</TabsTrigger>
          <TabsTrigger value="policies">Policies</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Documents</CardTitle>
              <CardDescription>Browse and manage all documents in your workspace</CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentBrowser />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Policies</CardTitle>
              <CardDescription>Company policies and procedure documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-spotify-lightgray">
                <p>This section will display filtered policy documents.</p>
                <p>Folder filtering will be implemented in future updates.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="templates">
          <Card>
            <CardHeader>
              <CardTitle>Templates</CardTitle>
              <CardDescription>Document templates for RFT responses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-6 text-spotify-lightgray">
                <p>This section will display filtered template documents.</p>
                <p>Folder filtering will be implemented in future updates.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default DmsHome;
