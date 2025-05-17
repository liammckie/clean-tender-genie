
import React from 'react';
import { FileText, Folder, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DocumentItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  updatedAt: string;
}

// Mock data - in a real app, this would come from your backend
const mockDocuments: DocumentItem[] = [
  { id: '1', name: 'Project Proposals', type: 'folder', updatedAt: '2023-10-15' },
  { id: '2', name: 'Client Policies', type: 'folder', updatedAt: '2023-09-22' },
  { id: '3', name: 'RFT Response Draft.docx', type: 'file', updatedAt: '2023-10-28' },
  { id: '4', name: 'Meeting Minutes.docx', type: 'file', updatedAt: '2023-10-20' },
  { id: '5', name: 'Cleaning Procedures.docx', type: 'file', updatedAt: '2023-10-18' },
];

const DocumentBrowser: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Search and filter */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-spotify-lightgray" />
        <Input 
          placeholder="Search documents..." 
          className="pl-10 bg-spotify-darkgray border-spotify-gray"
        />
      </div>
      
      {/* Document list */}
      <div className="bg-spotify-darkgray rounded-lg border border-spotify-gray overflow-hidden">
        <div className="grid grid-cols-12 py-2 px-4 border-b border-spotify-gray text-sm font-medium text-spotify-lightgray">
          <div className="col-span-7">Name</div>
          <div className="col-span-3">Last Modified</div>
          <div className="col-span-2">Actions</div>
        </div>
        
        <div className="divide-y divide-spotify-gray">
          {mockDocuments.map((doc) => (
            <div 
              key={doc.id} 
              className="grid grid-cols-12 py-3 px-4 hover:bg-[#282828] transition-colors items-center"
            >
              <div className="col-span-7 flex items-center">
                {doc.type === 'folder' ? (
                  <Folder className="h-5 w-5 mr-3 text-spotify-green" />
                ) : (
                  <FileText className="h-5 w-5 mr-3 text-spotify-lightgray" />
                )}
                <span>{doc.name}</span>
              </div>
              <div className="col-span-3 text-spotify-lightgray text-sm">
                {doc.updatedAt}
              </div>
              <div className="col-span-2 flex space-x-2">
                <Button variant="ghost" size="sm" className="h-8 px-2">
                  Open
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DocumentBrowser;
