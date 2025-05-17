
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

const DmsDocumentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // In a real app, you'd fetch document details based on id
  const documentDetails = {
    name: 'RFT Response Draft.docx',
    type: 'Word Document',
    size: '245 KB',
    createdAt: 'October 15, 2023',
    updatedAt: 'October 28, 2023',
    createdBy: 'John Doe',
    description: 'Draft response for the Commercial Cleaning Services RFT',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/dms')}
          className="hover:bg-spotify-darkgray"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Documents
        </Button>
      </div>
      
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold">{documentDetails.name}</h2>
          <p className="text-spotify-lightgray">
            Last updated on {documentDetails.updatedAt} by {documentDetails.createdBy}
          </p>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-[#333333]">
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
          <Button variant="outline" size="sm" className="border-[#333333]">
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button variant="outline" size="sm" className="border-[#333333] hover:bg-red-900 hover:text-red-100">
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>
      
      <Card className="bg-spotify-darkgray border-spotify-gray p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-4">Document Information</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-spotify-lightgray">Type:</span>
                <span>{documentDetails.type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-spotify-lightgray">Size:</span>
                <span>{documentDetails.size}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-spotify-lightgray">Created:</span>
                <span>{documentDetails.createdAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-spotify-lightgray">Modified:</span>
                <span>{documentDetails.updatedAt}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-spotify-lightgray">Created By:</span>
                <span>{documentDetails.createdBy}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-4">Description</h3>
            <p className="text-spotify-lightgray">{documentDetails.description}</p>
          </div>
        </div>
      </Card>
      
      <div className="bg-spotify-darkgray rounded-lg p-6 border border-spotify-gray">
        <h3 className="text-lg font-medium mb-4">Document Preview</h3>
        <div className="bg-[#1c1c1c] h-80 rounded flex items-center justify-center">
          <p className="text-spotify-lightgray">Preview not available. Download or edit to view the document.</p>
        </div>
      </div>
    </div>
  );
};

export default DmsDocumentDetails;
