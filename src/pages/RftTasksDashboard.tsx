import React, { useState } from 'react';
import { useAppStore } from '@/hooks/useAppStore';
import { useToast } from '@/hooks/use-toast';
import Layout from '../components/layout/Layout';
import { FileUploader } from '../components/FileUploader';
import { Button } from '@/components/ui/button';
import { fetchJson } from '@/utils/api';
import { Loader } from 'lucide-react';

interface GenerateResponse {
  taskId: string;
  status: string;
}

const RftTasksDashboard = () => {
  const { storeId, status, error } = useAppStore();
  const { toast } = useToast();
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!storeId) return;

    setGenerating(true);
    try {
      const result = await fetchJson<GenerateResponse>('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storeId }),
      });

      toast({
        title: 'Generation Started',
        description: `Task ID: ${result.taskId} is now ${result.status}`,
      });
    } catch (err: any) {
      toast({
        title: 'Generation Failed',
        description: err.message || 'Something went wrong',
        variant: 'destructive',
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold">RFT Tasks</h2>
          <Button
            onClick={handleGenerate}
            disabled={status !== 'uploaded' || generating}
            className="flex items-center gap-2"
          >
            {generating && <Loader className="animate-spin h-4 w-4" />}
            Generate Response
          </Button>
        </div>

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Upload New RFT</h3>
          <FileUploader
            onUploaded={(id) => {
              toast({
                title: 'Upload Successful',
                description: `RFT uploaded with ID: ${id}`,
              });
            }}
          />
        </div>

        {status === 'uploaded' && (
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-md border border-green-200 dark:border-green-900/30">
            <p className="text-green-700 dark:text-green-300">
              RFT Document ready for processing (ID: {storeId})
            </p>
          </div>
        )}

        <div className="bg-card rounded-lg p-6 shadow-sm border">
          <h3 className="text-xl font-semibold mb-4">Recent Tasks</h3>
          <p className="text-muted-foreground">No recent tasks found.</p>
        </div>
      </div>
    </Layout>
  );
};

export default RftTasksDashboard;
