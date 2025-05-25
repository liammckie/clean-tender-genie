
import Layout from '@/components/layout/Layout';
import GoogleDriveBrowser from '@/components/GoogleDriveBrowser';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const GoogleDriveTest = () => {
  return (
    <Layout>
      <div className="p-6">
        <Card className="bg-spotify-darkgray border-spotify-gray">
          <CardHeader>
            <CardTitle className="text-white">Google Drive Integration</CardTitle>
            <CardDescription className="text-spotify-lightgray">
              Browse and select files from your Google Drive
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GoogleDriveBrowser />
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default GoogleDriveTest;
