
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { GoogleGenerativeAI } from '@google/generative-ai';
=======

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
    'GOOGLE_API_KEY',
    'SUPABASE_URL',
    'SUPABASE_SERVICE_ROLE_KEY',
  ];
  const missingEnvVars = validateEnvVars(requiredEnvVars);

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
