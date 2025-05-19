import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { validateEnvVars } from './utils';

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
  const requiredEnvVars = [
    'GOOGLE_API_KEY',
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
    const { storeId, driveFileId, outputFolderId } = req.body;

    if (!storeId && !driveFileId) {
      return res
        .status(400)
        .json({ message: 'Missing required parameter: storeId or driveFileId' });
    }

    let rftContent = '';
    let source: 'local' | 'google-drive' = 'local';

    if (storeId) {
      const { data, error } = await supabase.storage
        .from('rft-files')
        .download(storeId);
      if (error || !data) {
        throw new Error(error?.message || 'Failed to download RFT document');
      }
      const buf = await data.arrayBuffer();
      rftContent = Buffer.from(buf).toString('utf-8');
    } else if (driveFileId) {
      source = 'google-drive';
      const { data, error } = await supabase.functions.invoke('google-drive', {
        body: { action: 'downloadFile', fileId: driveFileId },
      });
      if (error || !data?.data?.content) {
        throw new Error(error?.message || 'Failed to download file from Google Drive');
      }
      rftContent = Buffer.from(data.data.content, 'base64').toString('utf-8');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? 'gemini-1.5-flash',
    });

    const geminiRes = await model.generateContent(rftContent);
    const generated = geminiRes.response.text();

    const outputPath = `generated/response-${Date.now()}.md`;
    const { error: uploadErr } = await supabase.storage
      .from('rft-files')
      .upload(outputPath, generated, {
        contentType: 'text/markdown',
        upsert: true,
      });

    if (uploadErr) {
      throw new Error(uploadErr.message);
    }

    const { data: taskData, error: dbErr } = await supabase
      .from('rft_tasks')
      .insert({
        rft_file_id: storeId ?? driveFileId,
        output_file_id: outputPath,
        status: 'completed',
        source,
      })
      .select()
      .single();

    if (dbErr) {
      throw new Error(dbErr.message);
    }

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
      taskId: taskData.id,
      status: taskData.status,
      outputFileId: taskData.output_file_id,
      source,
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
