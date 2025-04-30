
import React from 'react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { CircleDot, Hexagon, Cog } from 'lucide-react';
import { LLMConfig, LLMProvider, LLMMode } from '@/pages/DocumentEditor';

interface LLMConfigSidebarProps {
  config: LLMConfig;
  setConfig: (config: LLMConfig) => void;
}

const LLMConfigSidebar: React.FC<LLMConfigSidebarProps> = ({ config, setConfig }) => {
  const handleProviderChange = (value: string) => {
    setConfig({
      ...config,
      provider: value as LLMProvider
    });
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

  const getProviderIcon = (provider: string) => {
    switch (provider) {
      case 'openai':
        return <CircleDot className="h-4 w-4 text-green-500" />;
      case 'gemini':
        return <CircleDot className="h-4 w-4 text-blue-500" />;
      case 'deepseek':
        return <Hexagon className="h-4 w-4 text-purple-500" />;
      default:
        return <Cog className="h-4 w-4" />;
    }
  };

  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-semibold mb-4">LLM Configuration</h2>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Provider</CardTitle>
          <CardDescription className="text-xs">Select your LLM provider</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={config.provider} onValueChange={handleProviderChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai" className="flex items-center">
                <div className="flex items-center">
                  {getProviderIcon('openai')}
                  <span className="ml-2">OpenAI</span>
                </div>
              </SelectItem>
              <SelectItem value="gemini" className="flex items-center">
                <div className="flex items-center">
                  {getProviderIcon('gemini')}
                  <span className="ml-2">Gemini Pro 2.5</span>
                </div>
              </SelectItem>
              <SelectItem value="deepseek" className="flex items-center">
                <div className="flex items-center">
                  {getProviderIcon('deepseek')}
                  <span className="ml-2">DeepSeek</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Mode</CardTitle>
          <CardDescription className="text-xs">Select interaction mode</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={config.mode} onValueChange={handleModeChange}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="single">Single Request</SelectItem>
              <SelectItem value="agent">Agent (Multi-turn)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Temperature</CardTitle>
          <CardDescription className="text-xs">Adjust response creativity: {config.temperature.toFixed(1)}</CardDescription>
        </CardHeader>
        <CardContent>
          <Slider 
            value={[config.temperature]} 
            min={0} 
            max={1} 
            step={0.1} 
            onValueChange={handleTemperatureChange} 
          />
        </CardContent>
      </Card>
      
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Max Tokens</CardTitle>
          <CardDescription className="text-xs">Response length: {config.maxTokens}</CardDescription>
        </CardHeader>
        <CardContent>
          <Slider 
            value={[config.maxTokens]} 
            min={100} 
            max={4000} 
            step={100} 
            onValueChange={handleMaxTokensChange} 
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default LLMConfigSidebar;
