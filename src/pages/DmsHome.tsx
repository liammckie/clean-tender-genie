
import React from 'react';
import { Link } from 'react-router-dom';
import { FolderOpen, FileText, Upload, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const DmsHome = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Document Management System</h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Upload Document
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-spotify-darkgray border-none hover:bg-[#282828] transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <FolderOpen className="h-6 w-6 text-spotify-green" />
              <h3 className="text-lg font-semibold ml-3">My Documents</h3>
            </div>
            <p className="text-spotify-lightgray mb-6">
              Access all your documents in one place. View, edit, and manage your files.
            </p>
            <div className="mt-auto">
              <Button variant="outline" className="border-[#333333] hover:bg-[#1c1c1c]">
                Browse Documents
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-spotify-darkgray border-none hover:bg-[#282828] transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <FileText className="h-6 w-6 text-spotify-green" />
              <h3 className="text-lg font-semibold ml-3">Templates</h3>
            </div>
            <p className="text-spotify-lightgray mb-6">
              Start with pre-designed templates for common document types and RFT responses.
            </p>
            <div className="mt-auto">
              <Button variant="outline" className="border-[#333333] hover:bg-[#1c1c1c]">
                View Templates
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-spotify-darkgray border-none hover:bg-[#282828] transition-all duration-300 cursor-pointer">
          <CardContent className="p-6 flex flex-col h-full">
            <div className="flex items-center mb-4">
              <Settings className="h-6 w-6 text-spotify-green" />
              <h3 className="text-lg font-semibold ml-3">DMS Settings</h3>
            </div>
            <p className="text-spotify-lightgray mb-6">
              Configure document categories, permissions, and integration settings.
            </p>
            <div className="mt-auto">
              <Button variant="outline" className="border-[#333333] hover:bg-[#1c1c1c]">
                Open Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 bg-spotify-darkgray rounded-lg p-6 shadow-sm border border-spotify-gray">
        <h3 className="text-xl font-semibold mb-4">Recent Documents</h3>
        <div className="space-y-2">
          {/* This would be populated from your backend data */}
          <div className="p-3 hover:bg-[#282828] rounded-md flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-spotify-lightgray" />
              <span>RFT Response Template.docx</span>
            </div>
            <span className="text-sm text-spotify-lightgray">Updated 2 days ago</span>
          </div>
          <div className="p-3 hover:bg-[#282828] rounded-md flex justify-between items-center">
            <div className="flex items-center">
              <FileText className="h-5 w-5 mr-3 text-spotify-lightgray" />
              <span>Cleaning Services Proposal.docx</span>
            </div>
            <span className="text-sm text-spotify-lightgray">Updated 5 days ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DmsHome;
