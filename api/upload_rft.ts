import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import formidable, { File } from 'formidable';
import fs from 'fs';
import { randomUUID } from 'crypto';

export const config = {
  api: {
    bodyParser: false,
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
      message: `Missing required environment variables: ${missingEnvVars.join(', ')}`,
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const form = new formidable.IncomingForm();
    const { files } = await new Promise<{
      fields: formidable.Fields;
      files: formidable.Files;
    }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve({ fields, files });
      });
    });

    const uploaded = files.file as File | undefined;
    if (!uploaded) {
      return res.status(400).json({ message: 'File not provided' });
    }

    const ACCEPTED_TYPES = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    const MAX_SIZE = 20 * 1024 * 1024; // 20MB

    if (!uploaded.mimetype || !ACCEPTED_TYPES.includes(uploaded.mimetype)) {
      return res.status(400).json({ message: 'Invalid file type' });
    }
    if (uploaded.size && uploaded.size > MAX_SIZE) {
      return res.status(400).json({ message: 'File size exceeds limit' });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    const fileExt = uploaded.originalFilename?.split('.').pop() || 'dat';
    const fileName = `${randomUUID()}.${fileExt}`;

    const { data: storeData, error: uploadError } = await supabase.storage
      .from('rft-uploads')
      .upload(fileName, fs.createReadStream(uploaded.filepath), {
        contentType: uploaded.mimetype || undefined,
      });

    if (uploadError) {
      console.error('Supabase upload error:', uploadError);
      throw new Error(uploadError.message);
    }

    const path = storeData?.path || fileName;

    const { data: taskData, error: taskError } = await supabase
      .from('rft_tasks')
      .insert({
        name: uploaded.originalFilename,
        status: 'pending',
        rftFileId: path,
      })
      .select()
      .single();

    if (taskError) {
      console.error('Supabase insert error:', taskError);
      throw new Error(taskError.message);
    }

    return res.status(200).json({ storeId: path, taskId: taskData.id });
  } catch (error: any) {
    console.error('Error uploading RFT:', error);
    return res
      .status(500)
      .json({ message: error.message || 'Failed to upload RFT' });
  }
}
