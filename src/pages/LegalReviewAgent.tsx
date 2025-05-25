
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertTriangle, FileCheck } from 'lucide-react';

const LegalReviewAgent = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">Legal Review Agent</h1>
        <p className="text-spotify-lightgray mb-8">
          AI-powered legal compliance checking for tender responses.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Compliance Check
              </CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Automated review of legal requirements and compliance standards
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full">Run Compliance Check</Button>
            </CardContent>
          </Card>
          
          <Card className="bg-spotify-darkgray border-spotify-gray">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
                Risk Assessment
              </CardTitle>
              <CardDescription className="text-spotify-lightgray">
                Identify potential legal risks in your tender response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full">Assess Risks</Button>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-spotify-darkgray border-spotify-gray">
          <CardHeader>
            <CardTitle className="flex items-center text-white">
              <FileCheck className="h-5 w-5 mr-2 text-spotify-green" />
              Review Results
            </CardTitle>
            <CardDescription className="text-spotify-lightgray">
              Latest compliance and legal review results
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-spotify-black rounded-md">
                <span className="text-white">Insurance Requirements</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-spotify-black rounded-md">
                <span className="text-white">WHS Compliance</span>
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-spotify-black rounded-md">
                <span className="text-white">Contract Terms</span>
                <AlertTriangle className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default LegalReviewAgent;
