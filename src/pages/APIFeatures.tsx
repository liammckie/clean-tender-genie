
import Layout from '@/components/layout/Layout';

const APIFeatures = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white mb-6">API Features</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-spotify-darkgray p-6 rounded-lg border border-spotify-gray">
            <h3 className="text-lg font-semibold text-white mb-4">OpenAI Integration</h3>
            <p className="text-spotify-lightgray">
              Leverage OpenAI's powerful models for RFT analysis and response generation.
            </p>
          </div>
          <div className="bg-spotify-darkgray p-6 rounded-lg border border-spotify-gray">
            <h3 className="text-lg font-semibold text-white mb-4">Google Drive API</h3>
            <p className="text-spotify-lightgray">
              Seamlessly integrate with Google Drive for document management.
            </p>
          </div>
          <div className="bg-spotify-darkgray p-6 rounded-lg border border-spotify-gray">
            <h3 className="text-lg font-semibold text-white mb-4">Supabase Backend</h3>
            <p className="text-spotify-lightgray">
              Robust backend services for data storage and user management.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default APIFeatures;
