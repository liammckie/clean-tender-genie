import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate environment variables
  const requiredEnvVars = [
    'OPENAI_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  const missingEnvVars = requiredEnvVars.filter(
    (varName) => !process.env[varName]
  );

  if (missingEnvVars.length > 0) {
    return res.status(500).json({
      message: `Missing required environment variables: ${missingEnvVars.join(', ')}`,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // TODO: Implement file upload handling logic
    // TODO: Validate file type and size server-side
    // TODO: Store the file in Supabase Storage
    // TODO: Create RFT task record in database

    // For now, just return a mock response
    return res.status(200).json({ storeId: `rft-${Date.now()}` });
  } catch (error: any) {
    console.error('Error uploading RFT:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Failed to upload RFT' });
  }
}
