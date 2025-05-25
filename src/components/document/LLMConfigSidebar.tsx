
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { LLMConfig, LLMProvider, LLMMode } from '@/pages/DocumentEditor';

interface LLMConfigSidebarProps {
  config: LLMConfig;
  setConfig: (config: LLMConfig) => void;
}

const LLMConfigSidebar = ({ config, setConfig }: LLMConfigSidebarProps) => {
  const updateConfig = (key: keyof LLMConfig, value: any) => {
    setConfig({ ...config, [key]: value });
  };

  return (
    <div className="p-4 space-y-6">
      <h3 className="text-lg font-semibold text-white">LLM Configuration</h3>
      
      <div className="space-y-2">
        <Label htmlFor="provider" className="text-spotify-lightgray">Provider</Label>
        <Select value={config.provider} onValueChange={(value: LLMProvider) => updateConfig('provider', value)}>
          <SelectTrigger id="provider" className="bg-spotify-darkgray border-spotify-gray text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-spotify-darkgray border-spotify-gray">
            <SelectItem value="openai" className="text-white hover:bg-spotify-gray">OpenAI</SelectItem>
            <SelectItem value="gemini" className="text-white hover:bg-spotify-gray">Gemini</SelectItem>
            <SelectItem value="deepseek" className="text-white hover:bg-spotify-gray">DeepSeek</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="mode" className="text-spotify-lightgray">Mode</Label>
        <Select value={config.mode} onValueChange={(value: LLMMode) => updateConfig('mode', value)}>
          <SelectTrigger id="mode" className="bg-spotify-darkgray border-spotify-gray text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-spotify-darkgray border-spotify-gray">
            <SelectItem value="single" className="text-white hover:bg-spotify-gray">Single</SelectItem>
            <SelectItem value="agent" className="text-white hover:bg-spotify-gray">Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label className="text-spotify-lightgray">Temperature: {config.temperature}</Label>
        <Slider
          value={[config.temperature]}
          onValueChange={(value) => updateConfig('temperature', value[0])}
          max={1}
          min={0}
          step={0.1}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label className="text-spotify-lightgray">Max Tokens: {config.maxTokens}</Label>
        <Slider
          value={[config.maxTokens]}
          onValueChange={(value) => updateConfig('maxTokens', value[0])}
          max={4000}
          min={100}
          step={100}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default LLMConfigSidebar;
