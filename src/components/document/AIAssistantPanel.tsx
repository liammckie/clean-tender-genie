
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';
import { LLMConfig } from '@/pages/DocumentEditor';
import { CircleDot, Hexagon, Sparkles } from 'lucide-react';
import { initGenKitClient, generateWithGenKit } from '@/lib/genkit-ai';

interface AIAssistantPanelProps {
  documentContent: string;
  setDocumentContent: (content: string) => void;
  llmConfig: LLMConfig;
}

const AIAssistantPanel: React.FC<AIAssistantPanelProps> = ({
  documentContent,
  setDocumentContent,
  llmConfig,
}) => {
  const [prompt, setPrompt] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [conversation, setConversation] = useState<{role: string, content: string}[]>([]);
  const [genKitClient, setGenKitClient] = useState<any>(null);
  
  // Initialize GenKit client when API key is available
  useEffect(() => {
    if (llmConfig.provider === 'genkit' && llmConfig.apiKey) {
      try {
        const client = initGenKitClient(llmConfig.apiKey);
        setGenKitClient(client);
        toast.success('GenKit client initialized successfully');
      } catch (error) {
        console.error('Failed to initialize GenKit client:', error);
        toast.error('Failed to initialize GenKit client');
      }
    }
  }, [llmConfig.provider, llmConfig.apiKey]);
  
  // Common prompts for document editing
  const commonPrompts = [
    "Summarize this section",
    "Make this paragraph more concise",
    "Improve the tone to be more professional",
    "Add compliance information about WHS standards",
    "Generate section about our environmental initiatives",
  ];

  const generateContent = async () => {
    if (prompt.trim() === '') {
      toast.error("Please enter a prompt");
      return;
    }

    setIsLoading(true);

    try {
      // Add user message to conversation if in agent mode
      if (llmConfig.mode === 'agent') {
        setConversation([...conversation, {role: 'user', content: prompt}]);
      }
      
      // Handle GenKit provider differently
      if (llmConfig.provider === 'genkit') {
        if (!genKitClient) {
          toast.error('GenKit client not initialized. Please check your API key.');
          setIsLoading(false);
          return;
        }
        
        try {
          const genkitResponse = await generateWithGenKit(genKitClient, prompt, {
            temperature: llmConfig.temperature,
            maxTokens: llmConfig.maxTokens
          });
          
          if (llmConfig.mode === 'agent') {
            setConversation([...conversation, {role: 'user', content: prompt}, {role: 'assistant', content: genkitResponse}]);
          }
          
          setSuggestions([...suggestions, genkitResponse]);
          toast.success(`Content generated using GenKit AI`);
        } catch (error) {
          console.error('Error with GenKit generation:', error);
          toast.error('Failed to generate content with GenKit');
        }
        
        setIsLoading(false);
        setPrompt('');
        return;
      }
      
      // Simulate API call delay for other providers
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate response based on selected provider and configuration
      let providerName = '';
      let response = '';
      
      switch (llmConfig.provider) {
        case 'openai':
          providerName = 'OpenAI';
          if (prompt.toLowerCase().includes("summarize")) {
            response = "## Executive Summary\n\nOur company offers industry-leading commercial cleaning services with a focus on quality, compliance with Australian WHS standards, and environmental sustainability. With over 15 years of experience, we deliver tailored solutions that meet the specific requirements of your facilities.";
          } else if (prompt.toLowerCase().includes("whs") || prompt.toLowerCase().includes("compliance")) {
            response = "## Compliance Information\n\nOur operations strictly adhere to all relevant Work Health and Safety legislation, including the Work Health and Safety Act 2011 and associated regulations. All staff undergo comprehensive training and certification in safe work practices, chemical handling, and emergency procedures. We maintain detailed documentation of all safety protocols and incident reporting systems.";
          } else {
            response = "## Generated Content (OpenAI)\n\nThis is a professionally generated response from OpenAI. The content is tailored to your document's context with temperature " + llmConfig.temperature + " and max tokens " + llmConfig.maxTokens + ". In a real implementation, this would be an actual API call to the OpenAI service.";
          }
          break;
        case 'gemini':
          providerName = 'Gemini Pro 2.5';
          response = "## Generated Content (Gemini Pro 2.5)\n\nThis is a response generated by Gemini Pro 2.5. The model has been configured with temperature " + llmConfig.temperature + " and max tokens " + llmConfig.maxTokens + ". In a real implementation, this would connect to Google's Gemini API for content generation.";
          break;
        case 'deepseek':
          providerName = 'DeepSeek';
          response = "## Generated Content (DeepSeek)\n\nThis is a response generated by DeepSeek. The model has been configured with temperature " + llmConfig.temperature + " and max tokens " + llmConfig.maxTokens + ". In a real implementation, this would connect to the DeepSeek API for advanced content generation.";
          break;
        default:
          providerName = 'Default LLM';
          response = "## Generated Content\n\nThis is a generic response. Please select a specific provider for more tailored content.";
      }
      
      // Add AI response to conversation if in agent mode
      if (llmConfig.mode === 'agent') {
        setConversation([...conversation, {role: 'user', content: prompt}, {role: 'assistant', content: response}]);
      }
      
      setSuggestions([...suggestions, response]);
      toast.success(`Content generated using ${providerName}`);
      
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsLoading(false);
      setPrompt(''); // Clear prompt field after generation
    }
  };

  const insertContent = (content: string) => {
    setDocumentContent(documentContent + "\n\n" + content);
    toast.success("Content inserted into document");
  };

  const handleCommonPromptClick = (promptText: string) => {
    setPrompt(promptText);
  };

  const getProviderIcon = () => {
    switch (llmConfig.provider) {
      case 'openai':
        return <CircleDot className="h-4 w-4 text-green-500" />;
      case 'gemini':
        return <CircleDot className="h-4 w-4 text-blue-500" />;
      case 'deepseek':
        return <Hexagon className="h-4 w-4 text-purple-500" />;
      case 'genkit':
        return <Sparkles className="h-4 w-4 text-yellow-500" />;
      default:
        return null;
    }
  };

  // Check if GenKit is selected but no API key provided
  const showApiKeyWarning = llmConfig.provider === 'genkit' && !llmConfig.apiKey;

  return (
    <div className="p-4 h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold">AI Assistant</h2>
        <div className="flex items-center text-sm text-muted-foreground">
          {getProviderIcon()}
          <span className="ml-1">
            {llmConfig.provider.charAt(0).toUpperCase() + llmConfig.provider.slice(1)} 
            {llmConfig.mode === 'agent' ? ' (Agent Mode)' : ' (Single Request)'}
          </span>
        </div>
      </div>
      
      {showApiKeyWarning && (
        <div className="mb-4 p-2 border border-yellow-500 bg-yellow-500/20 rounded text-sm">
          Please provide a GenKit API key in the LLM Configuration panel to use GenKit AI.
        </div>
      )}
      
      <div className="flex flex-wrap gap-2 mb-4">
        {commonPrompts.map((promptText, index) => (
          <Button 
            key={index} 
            variant="outline" 
            size="sm" 
            onClick={() => handleCommonPromptClick(promptText)}
          >
            {promptText}
          </Button>
        ))}
      </div>
      
      <div className="flex gap-2 mb-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for the AI assistant..."
          className="min-h-[80px]"
        />
        <Button 
          onClick={generateContent}
          disabled={isLoading || (llmConfig.provider === 'genkit' && !llmConfig.apiKey)}
          className="whitespace-nowrap"
        >
          {isLoading ? "Generating..." : "Generate"}
        </Button>
      </div>
      
      {llmConfig.mode === 'agent' && conversation.length > 0 && (
        <div className="flex-grow overflow-auto mb-4 border rounded-md p-2 bg-gray-50">
          <h3 className="text-sm font-medium mb-2">Conversation History</h3>
          {conversation.map((message, index) => (
            <div key={index} className={`mb-2 p-2 rounded ${message.role === 'user' ? 'bg-blue-50' : 'bg-green-50'}`}>
              <p className="text-xs font-medium">{message.role === 'user' ? 'You' : 'AI'}</p>
              <p className="text-sm">{message.content.length > 100 ? message.content.substring(0, 100) + '...' : message.content}</p>
            </div>
          ))}
        </div>
      )}
      
      <div className="flex-grow overflow-auto">
        {suggestions.length === 0 ? (
          <p className="text-gray-500 text-center">No suggestions yet</p>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion, index) => (
              <Card key={index} className="p-3">
                <pre className="whitespace-pre-wrap text-sm mb-2">{suggestion}</pre>
                <Button 
                  onClick={() => insertContent(suggestion)}
                  size="sm"
                  className="w-full"
                >
                  Insert into Document
                </Button>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AIAssistantPanel;
