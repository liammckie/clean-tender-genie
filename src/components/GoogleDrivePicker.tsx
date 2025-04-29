
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import GoogleDriveBrowser from './GoogleDriveBrowser';
import { GoogleDriveFile } from '@/services/googleDriveService';

interface GoogleDrivePickerProps {
  onSelect: (file: GoogleDriveFile) => void;
  trigger: React.ReactNode;
  title?: string;
  description?: string;
  onlyFolders?: boolean;
  onlyFiles?: boolean;
  allowedMimeTypes?: string[];
  initialFolderId?: string;
}

const GoogleDrivePicker: React.FC<GoogleDrivePickerProps> = ({
  onSelect,
  trigger,
  title = "Select from Google Drive",
  description = "Browse and select a file from your Google Drive",
  onlyFolders = false,
  onlyFiles = false,
  allowedMimeTypes,
  initialFolderId
}) => {
  const [open, setOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<GoogleDriveFile | null>(null);

  const handleSelect = () => {
    if (selectedFile) {
      onSelect(selectedFile);
      setOpen(false);
      setSelectedFile(null);
    }
  };

  const handleFileSelect = (file: GoogleDriveFile) => {
    setSelectedFile(file);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        
        <div className="py-4 max-h-[60vh] overflow-y-auto">
          <GoogleDriveBrowser 
            initialFolderId={initialFolderId}
            onFileSelect={!onlyFolders ? handleFileSelect : undefined}
            onFolderSelect={onlyFolders ? handleFileSelect : undefined}
            onlyFiles={onlyFiles}
            onlyFolders={onlyFolders}
            allowedMimeTypes={allowedMimeTypes}
          />
        </div>
        
        <DialogFooter>
          <div className="flex-1 text-sm">
            {selectedFile && (
              <span>Selected: <strong>{selectedFile.name}</strong></span>
            )}
          </div>
          <Button onClick={() => setOpen(false)} variant="outline">Cancel</Button>
          <Button 
            onClick={handleSelect} 
            disabled={!selectedFile}
          >
            Select
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default GoogleDrivePicker;
