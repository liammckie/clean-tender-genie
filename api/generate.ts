import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export const config = {
  api: {
    bodyParser: true,
  },
};

function validateEnvVars(vars: string[]) {
  return vars.filter((v) => !process.env[v]);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const missing = validateEnvVars([
    'GOOGLE_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ]);
  if (missing.length) {
    return res
      .status(500)
      .json({ message: `Missing required environment variables: ${missing.join(', ')}` });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { storeId, driveFileId, outputFolderId } = req.body as {
    storeId?: string;
    driveFileId?: string;
    outputFolderId?: string;
  };
  if (!storeId && !driveFileId) {
    return res
      .status(400)
      .json({ message: 'Missing required parameter: storeId or driveFileId' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL as string,
    process.env.SUPABASE_SERVICE_ROLE_KEY as string,
  );

  try {
    let rftContent = '';
    let source: 'local' | 'google-drive' = 'local';

    if (storeId) {
      const { data, error } = await supabase.storage.from('rft-files').download(storeId);
      if (error || !data) {
        throw new Error(error?.message || 'Failed to download RFT document');
      }
      const buf = await data.arrayBuffer();
      rftContent = Buffer.from(buf).toString('utf-8');
    } else if (driveFileId) {
      source = 'google-drive';
      const response = await supabase.functions.invoke('google-drive', {
        body: { action: 'downloadFile', fileId: driveFileId },
      });
      if (response.error) {
        throw new Error(
          response.error.message || 'Failed to download file from Google Drive',
        );
      }
      const fileData = response.data?.data;
      if (!fileData?.content) {
        throw new Error('Drive file did not return content');
      }
      rftContent = Buffer.from(fileData.content, 'base64').toString('utf-8');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY as string);
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

    return res.status(200).json({
      taskId: taskData.id,
      status: taskData.status,
      outputFileId: taskData.output_file_id,
      source,
    });
  } catch (error: any) {
    console.error('Error generating response:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Failed to generate response' });
  }
}
