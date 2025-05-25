
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, User } from 'lucide-react';

const IndividualRftTaskView = () => {
  return (
    <Layout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white mb-2">Commercial Cleaning Services RFT</h1>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="text-spotify-green border-spotify-green">
              In Progress
            </Badge>
            <span className="text-spotify-lightgray">Due: March 15, 2024</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-spotify-darkgray border-spotify-gray">
              <CardHeader>
                <CardTitle className="text-white">RFT Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-white font-medium mb-2">Project Description</h3>
                    <p className="text-spotify-lightgray">
                      Comprehensive cleaning services for a 50,000 sq ft commercial office building. 
                      Services include daily cleaning, window cleaning, carpet maintenance, and specialized sanitization.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-white font-medium mb-2">Key Requirements</h3>
                    <ul className="text-spotify-lightgray space-y-1">
                      <li>• 24/7 cleaning coverage</li>
                      <li>• Eco-friendly cleaning products</li>
                      <li>• Background-checked staff</li>
                      <li>• Insurance coverage minimum $2M</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-spotify-darkgray border-spotify-gray">
              <CardHeader>
                <CardTitle className="text-white">Response Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-spotify-lightgray">Executive Summary</span>
                    <Badge variant="secondary">Completed</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-spotify-lightgray">Technical Proposal</span>
                    <Badge variant="outline">In Progress</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-spotify-lightgray">Pricing Schedule</span>
                    <Badge variant="outline">Pending</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="bg-spotify-darkgray border-spotify-gray">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full">
                  <FileText className="h-4 w-4 mr-2" />
                  View Document
                </Button>
                <Button variant="outline" className="w-full">
                  <User className="h-4 w-4 mr-2" />
                  Assign Reviewer
                </Button>
                <Button variant="outline" className="w-full">
                  <Clock className="h-4 w-4 mr-2" />
                  Set Reminder
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-spotify-darkgray border-spotify-gray">
              <CardHeader>
                <CardTitle className="text-white">Timeline</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-spotify-green rounded-full mr-3"></div>
                    <span className="text-spotify-lightgray">RFT received - Jan 15</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-spotify-green rounded-full mr-3"></div>
                    <span className="text-spotify-lightgray">Analysis started - Jan 16</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-white">Drafting in progress - Jan 17</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default IndividualRftTaskView;
