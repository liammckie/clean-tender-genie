
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Validate environment variables
  const requiredEnvVars = [
    'GOOGLE_API_KEY',
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

    // Create a Supabase client using the service role key
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    let rftContent = '';
    let source: 'local' | 'google-drive' = 'local';

    if (storeId) {
      const { data, error } = await supabase
        .storage
        .from('rft-files')
        .download(storeId);

      if (error || !data) {
        throw new Error(error?.message || 'Failed to download RFT document');
      }

      const buf = await data.arrayBuffer();
      rftContent = Buffer.from(buf).toString('utf-8');
    } else if (driveFileId) {
      source = 'google-drive';
      const driveRes = await supabase.functions.invoke('google-drive', {
        body: { action: 'downloadFile', fileId: driveFileId },
      });

      if (driveRes.error) {
        throw new Error(driveRes.error.message || 'Failed to download Drive file');
      }

      const driveData = driveRes.data?.data;
      if (!driveData?.content) {
        throw new Error('Drive file did not return content');
      }
      rftContent = Buffer.from(driveData.content, 'base64').toString('utf-8');
    }

    // Generate a response using Google's Gemini model
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);
    const model = genAI.getGenerativeModel({
      model: process.env.GEMINI_MODEL ?? 'gemini-1.5-flash',
    });

    const geminiRes = await model.generateContent(rftContent);
    const generated = geminiRes.response.text();

    // Save generated result back to Supabase Storage
    const outputPath = `generated/response-${Date.now()}.md`;
    const { error: uploadErr } = await supabase
      .storage
      .from('rft-files')
      .upload(outputPath, generated, {
        contentType: 'text/markdown',
        upsert: true,
      });

    if (uploadErr) {
      throw new Error(uploadErr.message);
    }

    // Insert new task record with completed status
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
