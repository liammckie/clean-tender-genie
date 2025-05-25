
import { Badge } from '@/components/ui/badge';
import { CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DriveDocument } from '@/hooks/useDriveDocument';

interface DocumentHeaderProps {
  fileData: DriveDocument;
}

const DocumentHeader = ({ fileData }: DocumentHeaderProps) => {
  const getReadableFileType = (mimeType: string) => {
    if (mimeType === 'application/vnd.google-apps.document') return 'Google Doc';
    if (mimeType === 'application/vnd.google-apps.spreadsheet') return 'Google Sheet';
    if (mimeType === 'application/vnd.google-apps.presentation') return 'Google Slides';
    if (mimeType === 'application/vnd.google-apps.folder') return 'Google Drive Folder';
    if (mimeType === 'application/pdf') return 'PDF';
    if (mimeType === 'text/plain') return 'Text';
    if (mimeType === 'text/csv') return 'CSV';
    
    return mimeType.split('/').pop()?.toUpperCase() || mimeType;
  };

  const getFileTypeInfo = () => {
    if (!fileData) return "";
    
    if (fileData.originalMimeType && fileData.originalMimeType !== fileData.mimeType) {
      return `${getReadableFileType(fileData.originalMimeType)} (exported as ${getReadableFileType(fileData.mimeType)})`;
    }
    
    return getReadableFileType(fileData.mimeType);
  };

  return (
    <CardHeader>
      <CardTitle>{fileData.name}</CardTitle>
      <CardDescription className="flex items-center gap-2">
        {getFileTypeInfo()}
        {fileData.originalMimeType && (
          <Badge variant="outline" className="ml-2">
            {getReadableFileType(fileData.originalMimeType)}
          </Badge>
        )}
      </CardDescription>
    </CardHeader>
  );
};

export default DocumentHeader;
