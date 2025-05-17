import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { RftTask, rftTaskService } from '@/services/rftTaskService';
import { ArrowLeft, Clock, CheckCircle, Loader, AlertCircle, ExternalLink, Download, FileText } from 'lucide-react';

const RftTaskDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [task, setTask] = useState<RftTask | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const taskData = await rftTaskService.getTask(id);
        if (taskData) {
          setTask(taskData);
        } else {
          setError('Task not found');
        }
      } catch (err: any) {
        console.error('Error loading task:', err);
        setError(err.message || 'Failed to load task details');
        toast({
          title: 'Error',
          description: err.message || 'Failed to load task details',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    loadTask();
  }, [id, toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="flex items-center gap-1"><Clock className="h-3 w-3" /> Pending</Badge>;
      case 'processing':
        return <Badge variant="secondary" className="flex items-center gap-1"><Loader className="h-3 w-3 animate-spin" /> Processing</Badge>;
      case 'completed':
        return <Badge variant="secondary" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-200"><CheckCircle className="h-3 w-3" /> Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertCircle className="h-3 w-3" /> Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/rfts')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tasks
          </Button>
          <h1 className="text-xl font-bold">Task Details</h1>
        </div>

        {loading ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-10">
              <Loader className="h-10 w-10 animate-spin opacity-30 mb-4" />
              <p>Loading task details...</p>
            </CardContent>
          </Card>
        ) : error ? (
          <Alert variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : task ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{task.name}</CardTitle>
                    <CardDescription>Task ID: {task.id}</CardDescription>
                  </div>
                  {getStatusBadge(task.status)}
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Timeline</h3>
                    <div className="text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Created:</span>
                        <span>{new Date(task.createdAt).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Last Updated:</span>
                        <span>{new Date(task.updatedAt).toLocaleString()}</span>
                      </div>
                      {task.dueDate && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Due Date:</span>
                          <span className={new Date(task.dueDate) < new Date() ? "text-red-500 font-medium" : ""}>
                            {new Date(task.dueDate).toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Documents</h3>
                    <div className="space-y-2">
                      {task.rftFileId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => navigate(`/google-drive/documents/${task.rftFileId}`)}
                        >
                          <FileText className="mr-2 h-4 w-4 text-blue-500" />
                          View RFT Document
                        </Button>
                      )}
                      
                      {task.outputFileId && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full justify-start"
                          onClick={() => navigate(`/google-drive/documents/${task.outputFileId}`)}
                        >
                          <FileText className="mr-2 h-4 w-4 text-green-500" />
                          View Generated Response
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {task.status === 'processing' && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center">
                      <Loader className="animate-spin h-4 w-4 mr-2 text-blue-500" />
                      <p className="text-blue-800">This task is currently being processed. The page will automatically update when complete.</p>
                    </div>
                  </div>
                )}

                {task.status === 'failed' && (
                  <div className="mt-4 p-4 bg-red-50 rounded-lg border border-red-100">
                    <div className="flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2 text-red-500" />
                      <p className="text-red-800">This task failed to process. Please try regenerating the response.</p>
                    </div>
                  </div>
                )}
              </CardContent>
              <CardFooter className="flex justify-end gap-2">
                {task.status === 'completed' && task.outputFileId && (
                  <Button className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Download Response
                  </Button>
                )}
                
                {(task.status === 'failed' || task.status === 'completed') && (
                  <Button 
                    variant="secondary"
                    className="flex items-center gap-2"
                    onClick={() => {
                      toast({
                        title: 'Regenerate Initiated',
                        description: 'Starting new generation for this RFT'
                      });
                    }}
                  >
                    Regenerate Response
                  </Button>
                )}
              </CardFooter>
            </Card>
            
            {/* Additional sections can be added here for:
                - Compliance requirements extracted from the RFT
                - Progress tracking through the workflow steps
                - Review comments/feedback
                - Validation results */}
          </>
        ) : (
          <Card>
            <CardContent className="py-10 text-center">
              <p>Task not found.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default RftTaskDetail;
