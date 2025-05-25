
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const AgentsSDK = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Agents SDK</h1>
        <p className="text-spotify-lightgray mb-8">
          Develop and deploy custom AI agents for specialized RFT processing tasks.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="text-white">Compliance Agent</CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Specialized agent for compliance checking and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button>Deploy Agent</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="text-white">Content Generator</CardTitle>
              <CardDescription className="text-spotify-lightgray">
                AI agent for generating response content
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">Configure Agent</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AgentsSDK;
