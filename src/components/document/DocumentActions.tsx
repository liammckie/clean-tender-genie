
import { Download, ExternalLink, Wand2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DriveDocument } from '@/hooks/useDriveDocument';

interface DocumentActionsProps {
  fileData: DriveDocument;
  analyzing: boolean;
  drafting: boolean;
  onDownload: () => void;
  onAnalyze: () => void;
  onDraftTender: () => void;
}

const DocumentActions = ({ 
  fileData, 
  analyzing, 
  drafting, 
  onDownload, 
  onAnalyze, 
  onDraftTender 
}: DocumentActionsProps) => {
  return (
    <div className="flex gap-2">
      {fileData.webViewLink && (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          asChild
        >
          <a 
            href={fileData.webViewLink} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
            Open in Google Drive
          </a>
        </Button>
      )}
      
      {fileData.content && (
        <Button
          className="flex items-center gap-2"
          onClick={onDownload}
        >
          <Download className="h-4 w-4" />
          Download
        </Button>
      )}
      
      {fileData.content && (
        <Button
          variant="secondary"
          className="flex items-center gap-2"
          onClick={onAnalyze}
          disabled={analyzing}
        >
          <Wand2 className="h-4 w-4" />
          {analyzing ? 'Analysing...' : 'Analyse'}
        </Button>
      )}

      {fileData.content && (
        <Button
          variant="outline"
          className="flex items-center gap-2"
          onClick={onDraftTender}
          disabled={drafting}
        >
          <Wand2 className="h-4 w-4" />
          {drafting ? 'Drafting...' : 'Draft Tender'}
        </Button>
      )}
    </div>
  );
};

export default DocumentActions;
