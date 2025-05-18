
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL as string,
  process.env.SUPABASE_SERVICE_ROLE_KEY as string
);

export const config = {
  api: {
    bodyParser: true,
  },
};

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
      message: `Missing required environment variables: ${missingEnvVars.length ? missingEnvVars.join(', ') : 'none'}`,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { storeId, driveFileId, outputFolderId } = req.body;

    // Check if either a local uploaded file or a Google Drive file was provided
    if (!storeId && !driveFileId) {
      return res
        .status(400)
        .json({ message: 'Missing required parameter: storeId or driveFileId' });
    }

    // Log the source of the RFT document
    console.log('RFT source:', storeId ? 'Local upload' : 'Google Drive');
    if (driveFileId) {
      console.log('Google Drive File ID:', driveFileId);
    }
    
    // Log the output destination if specified
    if (outputFolderId) {
      console.log('Output Folder ID:', outputFolderId);
    }

    // Retrieve RFT content from Supabase storage or Google Drive
    let rftContent = '';
    if (storeId) {
      const { data, error } = await supabase.storage
        .from('rft-uploads')
        .download(storeId);
      if (error || !data) {
        throw new Error(error?.message || 'Failed to download RFT from storage');
      }
      rftContent = await new Response(data).text();
    } else if (driveFileId) {
      const { data, error } = await supabase.functions.invoke('google-drive', {
        body: { action: 'downloadFile', fileId: driveFileId },
      });
      if (error || !data?.data?.content) {
        throw new Error(
          error?.message || 'Failed to download file from Google Drive'
        );
      }
      rftContent = data.data.content as string;
    }

    // Process the RFT content using OpenAI Chat Completion API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content:
              'You are a helpful assistant that writes responses to tender documents.',
          },
          { role: 'user', content: rftContent },
        ],
      }),
    });

    const openaiJson = await openaiRes.json();
    const generated =
      openaiJson.choices?.[0]?.message?.content || 'No response generated.';

    // Optionally create a Google Doc with the generated response
    if (outputFolderId) {
      await supabase.functions.invoke('google-drive', {
        body: {
          action: 'createGoogleDoc',
          fileName: `Generated Response ${Date.now()}`,
          folderId: outputFolderId,
          content: generated,
        },
      });
    }

    return res.status(200).json({
      taskId: `task-${Date.now()}`,
      status: 'completed',
      source: storeId ? 'local' : 'google-drive',
      outputDestination: outputFolderId ? 'google-drive' : 'default',
      result: generated,
    });
  } catch (error: any) {
    console.error('Error generating response:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Failed to generate response' });
  }
}
