import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Save, Bold, Italic, Underline, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

const DocumentEditorToolbar = () => {
  return (
    <div className="flex items-center bg-white border rounded-md shadow-sm p-1 mb-4 overflow-x-auto">
      <Button variant="ghost" size="sm">
        <Save className="h-4 w-4 mr-1" />
        Save
      </Button>
      
      <Separator orientation="vertical" className="mx-2 h-6" />
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon">
          <Bold className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Italic className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Underline className="h-4 w-4" />
        </Button>
      </div>
      
      <Separator orientation="vertical" className="mx-2 h-6" />
      
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="icon">
          <AlignLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <AlignCenter className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <AlignRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="ml-auto flex items-center space-x-1">
        <span className="text-xs text-gray-500">Last saved: Just now</span>
      </div>
    </div>
  );
};

export default DocumentEditorToolbar;
