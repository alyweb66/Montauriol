import { NextRequest, NextResponse } from 'next/server';
import { handleUploadedFiles } from '../../../lib/handleUploadedFiles'; // Assure-toi que ton utilitaire est bien importé

type newMediaProps = {
  buffer: Buffer;
  name: string;
  type: string;
  size: number;
};


export async function POST(req: NextRequest) {

  try {
    // Get the media file from the request
    const formData = await req.formData();
    const media = formData.get('media') as File | null; // Récupère un fichier envoyé


    // Check if a file was uploaded
    if (!media || !(media instanceof File)) {
      return NextResponse.json({ error: 'No files uploaded' }, { status: 400 });
    }
    // convert the file to a buffer
    const arrayBuffer = await media.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);


    // Create a new media object
    const newMedia: newMediaProps = {
      buffer,
      name: media.name,
      type: media.type,
      size: media.size,
    };

    // Handle the uploaded files
    const uploadedFiles = await handleUploadedFiles([newMedia], false);
    return NextResponse.json({ success: true, files: uploadedFiles });

  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
