
import { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, Edit, Trash2 } from 'lucide-react';

const DmsDocumentDetails = () => {
  const { id } = useParams();
  const [document] = useState({
    id: id || '1',
    name: 'Sample Document.pdf',
    size: '2.5 MB',
    lastModified: '2024-01-15',
    type: 'PDF Document'
  });

  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Document Details</h1>
        
        <Card className="bg-spotify-darkgray border-spotify-gray">
          <CardHeader>
            <CardTitle className="text-white">{document.name}</CardTitle>
            <CardDescription className="text-spotify-lightgray">
              {document.type} • {document.size} • Last modified: {document.lastModified}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button variant="outline">
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button variant="destructive">
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DmsDocumentDetails;
