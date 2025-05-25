
import { FileText } from 'lucide-react';
import { DriveDocument } from '@/hooks/useDriveDocument';

interface DocumentViewerProps {
  fileData: DriveDocument;
}

const DocumentViewer = ({ fileData }: DocumentViewerProps) => {
  const renderFallbackContent = (fileType = "File") => (
    <div className="p-8 text-center">
      <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
      <p>{fileType} preview not available directly. Use the "Open in Google Drive" button to view this file.</p>
    </div>
  );

  const renderContent = () => {
    if (!fileData?.content) {
      return (
        <div className="p-8 text-center">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Content preview not available. Use the "Open in Google Drive" button to view this file.</p>
        </div>
      );
    }
    
    // Handle Google Doc exported as text/plain
    if (fileData.mimeType === 'text/plain') {
      try {
        const decodedContent = atob(fileData.content);
        return (
          <div className="p-4 bg-spotify-darkgray rounded border border-spotify-gray overflow-auto max-h-[500px]">
            <pre className="whitespace-pre-wrap text-sm">{decodedContent}</pre>
          </div>
        );
      } catch (e) {
        return renderFallbackContent();
      }
    }
    
    // Handle different file types
    if (fileData.mimeType.includes('application/pdf')) {
      try {
        const pdfData = `data:${fileData.mimeType};base64,${fileData.content}`;
        return (
          <div className="p-4 bg-spotify-darkgray rounded border border-spotify-gray overflow-auto h-[500px]">
            <iframe 
              src={pdfData} 
              className="w-full h-full" 
              title={fileData.name}
            />
          </div>
        );
      } catch (e) {
        return renderFallbackContent();
      }
    }
    
    // For Excel/Spreadsheet files
    if (fileData.mimeType.includes('spreadsheet') || 
        fileData.mimeType.includes('excel') || 
        fileData.mimeType.includes('sheet') ||
        fileData.mimeType.includes('csv')) {
      
      // If it's CSV, we can display it
      if (fileData.mimeType.includes('csv') || fileData.mimeType === 'text/csv') {
        try {
          const decodedContent = atob(fileData.content);
          return (
            <div className="p-4 bg-spotify-darkgray rounded border border-spotify-gray overflow-auto max-h-[500px]">
              <pre className="whitespace-pre-wrap text-sm font-mono">{decodedContent}</pre>
            </div>
          );
        } catch (e) {
          return renderFallbackContent();
        }
      }
      
      return renderFallbackContent("Spreadsheet");
    }
    
    // For text content, decode and display
    try {
      const decodedContent = atob(fileData.content);
      return (
        <div className="p-4 bg-spotify-darkgray rounded border border-spotify-gray overflow-auto max-h-[500px]">
          <pre className="whitespace-pre-wrap text-sm">{decodedContent}</pre>
        </div>
      );
    } catch (e) {
      return renderFallbackContent();
    }
  };

  return <>{renderContent()}</>;
};

export default DocumentViewer;
