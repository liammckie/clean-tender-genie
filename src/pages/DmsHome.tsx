
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Folder, Plus } from 'lucide-react';

const DmsHome = () => {
  const [documents] = useState([
    { id: 1, name: 'RFT Template.docx', type: 'document', size: '1.2 MB' },
    { id: 2, name: 'Compliance Docs', type: 'folder', items: 5 },
    { id: 3, name: 'Sample RFT.pdf', type: 'document', size: '3.4 MB' }
  ]);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Document Management</h1>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {documents.map((doc) => (
          <Card key={doc.id} className="bg-spotify-darkgray border-spotify-gray hover:border-spotify-green cursor-pointer">
            <CardHeader className="pb-3">
              <div className="flex items-center">
                {doc.type === 'folder' ? (
                  <Folder className="h-5 w-5 text-spotify-green mr-2" />
                ) : (
                  <FileText className="h-5 w-5 text-spotify-lightgray mr-2" />
                )}
                <CardTitle className="text-sm text-white">{doc.name}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-spotify-lightgray">
                {doc.type === 'folder' ? `${doc.items} items` : doc.size}
              </CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DmsHome;
