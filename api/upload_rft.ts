import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'crypto';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const config = {
  api: {
    bodyParser: false,
  },
};
import { validateEnvVars } from './utils';

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
  const missingEnvVars = validateEnvVars(requiredEnvVars);

  if (missingEnvVars.length > 0) {
    return res.status(500).json({
      message: `Missing required environment variables: ${missingEnvVars.join(', ')}`,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Read raw request body as Buffer
    const chunks: Buffer[] = [];
    for await (const chunk of req) {
      chunks.push(chunk as Buffer);
    }
    const body = Buffer.concat(chunks);

    // Simple validation of payload size (approximate)
    if (body.length > 20 * 1024 * 1024) {
      return res.status(400).json({ message: 'File size exceeds 20MB limit.' });
    }

    // Store the raw body in Supabase storage with a generated key
    const storeKey = `${randomUUID()}.bin`;
    const { error } = await supabase.storage
      .from('rft-uploads')
      .upload(storeKey, body, {
        contentType: 'application/octet-stream',
      });

    if (error) {
      throw new Error(error.message);
    }

    return res.status(200).json({ storeId: storeKey });
  } catch (error: any) {
    console.error('Error uploading RFT:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Failed to upload RFT' });
  }
}
