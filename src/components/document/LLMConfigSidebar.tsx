
import React, { useState } from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { CircleDot, Hexagon, Cog, Sparkles } from 'lucide-react';
import { LLMConfig, LLMProvider, LLMMode } from '@/pages/DocumentEditor';
import { toast } from 'sonner';

interface LLMConfigSidebarProps {
  config: LLMConfig;
  setConfig: (config: LLMConfig) => void;
}

const LLMConfigSidebar: React.FC<LLMConfigSidebarProps> = ({ config, setConfig }) => {
  const [apiKey, setApiKey] = useState(config.apiKey || '');

  const handleProviderChange = (value: string) => {
    // Reset API key if changing providers
    setConfig({
      ...config,
      provider: value as LLMProvider,
      apiKey: undefined
    });
    setApiKey('');
  };

  const handleModeChange = (value: string) => {
    setConfig({
      ...config,
      mode: value as LLMMode
    });
  };

  const handleTemperatureChange = (value: number[]) => {
    setConfig({
      ...config,
      temperature: value[0]
    });
  };

  const handleMaxTokensChange = (value: number[]) => {
    setConfig({
      ...config,
      maxTokens: value[0]
    });
  };

  const handleApiKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setApiKey(e.target.value);
  };

  const saveApiKey = () => {
    if (apiKey.trim()) {
      setConfig({
        ...config,
        apiKey
      });
      toast.success(`${config.provider.toUpperCase()} API key saved`);
    } else {
      toast.error("Please enter a valid API key");
    }
  };

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return <CircleDot className="h-4 w-4 text-spotify-green" />;
      case 'gemini':
        return <CircleDot className="h-4 w-4 text-blue-500" />;
      case 'deepseek':
        return <Hexagon className="h-4 w-4 text-purple-500" />;
      case 'genkit':
        return <Sparkles className="h-4 w-4 text-yellow-500" />;
      default:
        return <Cog className="h-4 w-4" />;
    }
  };

  // Check if the current provider needs an API key
  const needsApiKey = config.provider === 'genkit';

  return (
    <div className="h-full p-4 text-white">
      <h2 className="text-lg font-semibold mb-4">LLM Configuration</h2>
      
      <Card className="mb-4 bg-spotify-darkgray border-spotify-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white">Provider</CardTitle>
          <CardDescription className="text-xs text-spotify-lightgray">Select your LLM provider</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={config.provider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-full bg-[#1e1e1e] border-spotify-gray text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-spotify-darkgray border-spotify-gray">
              <SelectItem value="openai" className="focus:bg-[#2a2a2a] focus:text-white">
                <div className="flex items-center">
                  {getProviderIcon('openai')}
                  <span className="ml-2">OpenAI</span>
                </div>
              </SelectItem>
              <SelectItem value="gemini" className="focus:bg-[#2a2a2a] focus:text-white">
                <div className="flex items-center">
                  {getProviderIcon('gemini')}
                  <span className="ml-2">Gemini Pro 2.5</span>
                </div>
              </SelectItem>
              <SelectItem value="deepseek" className="focus:bg-[#2a2a2a] focus:text-white">
                <div className="flex items-center">
                  {getProviderIcon('deepseek')}
                  <span className="ml-2">DeepSeek</span>
                </div>
              </SelectItem>
              <SelectItem value="genkit" className="focus:bg-[#2a2a2a] focus:text-white">
                <div className="flex items-center">
                  {getProviderIcon('genkit')}
                  <span className="ml-2">GenKit AI</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      {needsApiKey && (
        <Card className="mb-4 bg-spotify-darkgray border-spotify-gray">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white">GenKit API Key</CardTitle>
            <CardDescription className="text-xs text-spotify-lightgray">Required for GenKit integration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <Input
              type="password"
              placeholder="Enter GenKit API key"
              value={apiKey}
              onChange={handleApiKeyChange}
              className="bg-[#1e1e1e] border-spotify-gray text-white"
            />
            <Button 
              onClick={saveApiKey} 
              size="sm" 
              className="w-full bg-spotify-green hover:bg-spotify-green/90 text-black"
            >
              Save API Key
            </Button>
          </CardContent>
        </Card>
      )}
      
      <Card className="mb-4 bg-spotify-darkgray border-spotify-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white">Mode</CardTitle>
          <CardDescription className="text-xs text-spotify-lightgray">Select interaction mode</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={config.mode} onValueChange={handleModeChange}>
            <SelectTrigger className="w-full bg-[#1e1e1e] border-spotify-gray text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-spotify-darkgray border-spotify-gray">
              <SelectItem value="single" className="focus:bg-[#2a2a2a] focus:text-white">Single Request</SelectItem>
              <SelectItem value="agent" className="focus:bg-[#2a2a2a] focus:text-white">Agent (Multi-turn)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card className="mb-4 bg-spotify-darkgray border-spotify-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white">Temperature</CardTitle>
          <CardDescription className="text-xs text-spotify-lightgray">
            Adjust response creativity: {config.temperature.toFixed(1)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Slider 
            value={[config.temperature]} 
            min={0} 
            max={1} 
            step={0.1} 
            onValueChange={handleTemperatureChange}
            className="[&>span]:bg-spotify-green"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-spotify-lightgray">Precise</span>
            <span className="text-xs text-spotify-lightgray">Creative</span>
          </div>
        </CardContent>
      </Card>
      
      <Card className="mb-4 bg-spotify-darkgray border-spotify-gray">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white">Max Tokens</CardTitle>
          <CardDescription className="text-xs text-spotify-lightgray">
            Response length: {config.maxTokens}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Slider 
            value={[config.maxTokens]} 
            min={100} 
            max={4000} 
            step={100} 
            onValueChange={handleMaxTokensChange}
            className="[&>span]:bg-spotify-green"
          />
          <div className="flex justify-between mt-1">
            <span className="text-xs text-spotify-lightgray">Short</span>
            <span className="text-xs text-spotify-lightgray">Long</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMConfigSidebar;
