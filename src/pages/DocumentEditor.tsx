
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import DocumentEditorToolbar from '@/components/document/DocumentEditorToolbar';
import DocumentContent from '@/components/document/DocumentContent';
import ReviewSidebar from '@/components/document/ReviewSidebar';
import AIAssistantPanel from '@/components/document/AIAssistantPanel';
import LLMConfigSidebar from '@/components/document/LLMConfigSidebar';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X, Settings, MessageSquare, FileCheck } from 'lucide-react';

// Define the LLM provider types
export type LLMProvider = 'openai' | 'gemini' | 'deepseek' | 'genkit';
export type LLMMode = 'single' | 'agent';

// LLM Configuration type
export interface LLMConfig {
  provider: LLMProvider;
  mode: LLMMode;
  temperature: number;
  maxTokens: number;
}

const DocumentEditor = () => {
  const { id } = useParams();
  const [showReviewSidebar, setShowReviewSidebar] = useState(false);
  const [showAIPanel, setShowAIPanel] = useState(false);
  const [showLLMConfig, setShowLLMConfig] = useState(false);
  
  // LLM Configuration state
  const [llmConfig, setLLMConfig] = useState<LLMConfig>({
    provider: 'openai',
    mode: 'single',
    temperature: 0.7,
    maxTokens: 1000
  });
  
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
  const toggleLLMConfig = () => setShowLLMConfig(!showLLMConfig);

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-2rem)]">
        <div className="flex justify-between items-center mb-2">
          <h1 className="text-xl font-semibold text-white">Document Editor: {id || 'New Document'}</h1>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleLLMConfig}
              className={showLLMConfig ? "bg-spotify-darkgray border-spotify-green" : ""}
            >
              <Settings className="h-4 w-4 mr-1" />
              LLM Config
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleReviewSidebar}
              className={showReviewSidebar ? "bg-spotify-darkgray border-spotify-green" : ""}
            >
              <FileCheck className="h-4 w-4 mr-1" />
              {showReviewSidebar ? "Hide Reviews" : "Show Reviews"}
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={toggleAIPanel}
              className={showAIPanel ? "bg-spotify-darkgray border-spotify-green" : ""}
            >
              <MessageSquare className="h-4 w-4 mr-1" />
              {showAIPanel ? "Hide AI" : "AI Assist"}
            </Button>
          </div>
        </div>
        <Separator className="mb-2 bg-spotify-gray" />
        
        <DocumentEditorToolbar />
        
        <div className="flex flex-grow overflow-hidden">
          {showLLMConfig && (
            <div className="w-64 border-r border-spotify-gray overflow-auto relative bg-spotify-black">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-spotify-lightgray hover:text-white"
                onClick={toggleLLMConfig}
              >
                <X className="h-4 w-4" />
              </Button>
              <LLMConfigSidebar 
                config={llmConfig} 
                setConfig={setLLMConfig} 
              />
            </div>
          )}
          
          <div className="flex-grow overflow-auto">
            <DocumentContent 
              content={documentContent} 
              setContent={setDocumentContent} 
            />
          </div>
          
          {showReviewSidebar && (
            <div className="w-80 border-l border-spotify-gray overflow-auto relative bg-spotify-black">
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-spotify-lightgray hover:text-white"
                onClick={toggleReviewSidebar}
              >
                <X className="h-4 w-4" />
              </Button>
              <ReviewSidebar documentId={id} />
            </div>
          )}
        </div>
        
        {showAIPanel && (
          <div className="border-t border-spotify-gray h-64 overflow-auto relative bg-spotify-darkgray">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 text-spotify-lightgray hover:text-white"
              onClick={toggleAIPanel}
            >
              <X className="h-4 w-4" />
            </Button>
            <AIAssistantPanel 
              documentContent={documentContent}
              setDocumentContent={setDocumentContent}
              llmConfig={llmConfig}
            />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default DocumentEditor;
