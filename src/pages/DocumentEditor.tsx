
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DocumentEditorToolbar from '@/components/document/DocumentEditorToolbar';
import DocumentContent from '@/components/document/DocumentContent';
import ReviewSidebar from '@/components/document/ReviewSidebar';
import AIAssistantPanel from '@/components/document/AIAssistantPanel';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const DocumentEditor = () => {
  const { id } = useParams();
  const [showReviewSidebar, setShowReviewSidebar] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  
  // Mock document data - in a real app, fetch this from your backend
  const [documentContent, setDocumentContent] = useState(
    `# RFT Response: Commercial Cleaning Services Proposal

## Executive Summary
Our proposal offers comprehensive cleaning services tailored to your specific requirements with a focus on quality, compliance, and sustainability.

## Company Background
With over 15 years of experience in commercial cleaning, we have established a strong reputation for reliability and excellence.`
  );

  const toggleReviewSidebar = () => setShowReviewSidebar(!showReviewSidebar);
  const toggleAIPanel = () => setShowAIPanel(!showAIPanel);

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-semibold">Document Editor: {id || 'New Document'}</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleReviewSidebar}
              className={showReviewSidebar ? "bg-secondary" : ""}
            >
              {showReviewSidebar ? "Hide Reviews" : "Show Reviews"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAIPanel}
              className={showAIPanel ? "bg-secondary" : ""}
            >
              {showAIPanel ? "Hide AI" : "AI Assist"}
            </Button>
          </div>
        </div>
        <Separator className="mb-2" />
        
        <DocumentEditorToolbar />
        
        <div className="flex flex-grow overflow-hidden">
          <div className="flex-grow overflow-auto">
            <DocumentContent 
              content={documentContent} 
              setContent={setDocumentContent} 
            />
          </div>
          
          {showReviewSidebar && (
            <div className="w-80 border-l overflow-auto relative">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2"
                onClick={toggleReviewSidebar}
              >
                <X className="h-4 w-4" />
              </Button>
              <ReviewSidebar documentId={id} />
            </div>
          )}
        </div>
        
        {showAIPanel && (
          <div className="border-t h-64 overflow-auto relative">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2"
              onClick={toggleAIPanel}
            >
              <X className="h-4 w-4" />
            </Button>
            <AIAssistantPanel 
              documentContent={documentContent}
              setDocumentContent={setDocumentContent}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DocumentEditor;
