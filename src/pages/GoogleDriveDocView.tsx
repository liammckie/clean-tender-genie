
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader } from 'lucide-react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useDriveDocument } from "@/hooks/useDriveDocument";
import { useTenderAi } from "@/hooks/useTenderAi";
import DocumentViewer from '@/components/document/DocumentViewer';
import DocumentActions from '@/components/document/DocumentActions';
import DocumentHeader from '@/components/document/DocumentHeader';
import AnalysisDisplay from '@/components/document/AnalysisDisplay';
import DraftDisplay from '@/components/document/DraftDisplay';

const GoogleDriveDocView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { loading, fileData, error } = useDriveDocument(id);
  const { analyzing, analysis, draft, drafting, saving, analyze, draftTender, saveDraft } = useTenderAi();

  const handleDownload = () => {
    if (!fileData?.content) return;
    
    try {
      const decodedContent = atob(fileData.content);
      const blob = new Blob([decodedContent], { type: fileData.mimeType });
      const url = URL.createObjectURL(blob);
      
      const a = document.createElement('a');
      a.href = url;
      a.download = fileData.name;
      a.click();
      
      URL.revokeObjectURL(url);
      
      toast({
        title: 'Success',
        description: 'File downloaded successfully',
      });
    } catch (err) {
      console.error('Download error:', err);
      toast({
        title: 'Download failed',
        description: 'Unable to download file',
        variant: 'destructive',
      });
    }
  };

  const handleAnalyze = async () => {
    if (!fileData?.content) return;
    try {
      await analyze(atob(fileData.content));
      toast({
        title: 'Analysis complete',
        description: 'Tender review generated'
      });
    } catch (err: any) {
      console.error('Analysis error:', err);
      toast({
        title: 'Analysis failed',
        description: err.message || 'Unable to analyse document',
        variant: 'destructive'
      });
    }
  };

  const handleDraftTender = async () => {
    if (!fileData?.content) return;
    try {
      await draftTender(atob(fileData.content));
      toast({ title: 'Draft created', description: 'Tender draft generated' });
    } catch (err: any) {
      console.error('Draft error:', err);
      toast({ title: 'Draft failed', description: err.message || 'Unable to draft tender', variant: 'destructive' });
    }
  };

  const handleSaveDraft = async () => {
    if (!fileData || !draft) return;
    try {
      await saveDraft(`${fileData.name} Draft`, draft);
      toast({ title: 'Draft saved', description: 'Google Doc created' });
    } catch (err: any) {
      console.error('Save draft error:', err);
      toast({ title: 'Save failed', description: err.message || 'Unable to save draft', variant: 'destructive' });
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <h1 className="text-xl font-bold">Google Drive Document</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Loader className="h-10 w-10 animate-spin opacity-30 mb-4" />
              <p>Loading document...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : fileData ? (
          <Card>
            <DocumentHeader fileData={fileData} />
            <CardContent>
              <DocumentViewer fileData={fileData} />
            </CardContent>
            <CardFooter className="flex justify-between">
              <div>
                {/* Additional actions can be added here */}
              </div>
              <DocumentActions
                fileData={fileData}
                analyzing={analyzing}
                drafting={drafting}
                onDownload={handleDownload}
                onAnalyze={handleAnalyze}
                onDraftTender={handleDraftTender}
              />
            </CardFooter>
          </Card>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p>No document found.</p>
            </CardContent>
          </Card>
        )}
        
        {analysis && <AnalysisDisplay analysis={analysis} />}
        
        {draft && (
          <DraftDisplay
            draft={draft}
            saving={saving}
            onSaveDraft={handleSaveDraft}
          />
        )}
      </div>
    </Layout>
  );
};

export default GoogleDriveDocView;
