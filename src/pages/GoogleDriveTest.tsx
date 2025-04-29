
import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, Loader } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GoogleDriveTest = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const testGoogleDriveConnection = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.functions.invoke('test-google-drive');
      
      if (error) throw error;
      
      setResult(data);
      toast({
        title: 'Test Complete',
        description: data.success ? 'Service key verification successful' : 'Service key verification failed',
      });
    } catch (err: any) {
      console.error('Error testing Google Drive service role key:', err);
      setError(err.message || 'An unknown error occurred');
      toast({
        title: 'Test Failed',
        description: err.message || 'An unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">Google Drive Service Key Test</h2>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Verify Google Drive Service Role Key</CardTitle>
            <CardDescription>
              Test if the Google Drive service role key is properly configured
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={testGoogleDriveConnection} 
              disabled={loading}
              className="flex gap-2 items-center"
            >
              {loading && <Loader size={16} className="animate-spin" />}
              Test Connection
            </Button>
            
            {result && (
              <Alert variant={result.success ? "default" : "destructive"}>
                <div className="flex items-center gap-2">
                  {result.success ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <AlertCircle className="h-5 w-5" />
                  )}
                  <AlertTitle>
                    {result.success ? "Service Key Found" : "Service Key Error"}
                  </AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  {result.success ? (
                    <div className="space-y-2">
                      <p>Service key was successfully loaded from environment variables.</p>
                      <ul className="list-disc pl-5 text-sm">
                        <li>Key length: {result.keyInfo.keyLength} characters</li>
                        <li>Key prefix: {result.keyInfo.keyPrefix}</li>
                        {result.tokenParts && <li>Token parts: {result.tokenParts} (JWT format)</li>}
                      </ul>
                    </div>
                  ) : (
                    <p>{result.error || "Unknown error occurred"}</p>
                  )}
                </AlertDescription>
              </Alert>
            )}
            
            {error && !result && (
              <Alert variant="destructive">
                <AlertCircle className="h-5 w-5" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GoogleDriveTest;
