import { NextRequest, NextResponse } from 'next/server';
import { handleUploadedFiles } from '../../../lib/handleUploadedFiles';
import { deleteMediaFiles } from '../../../lib/handleDeleteFile';

type newMediaProps = {
  buffer: Buffer;
  name: string;
  type: string;
  size: number;
};

// POST /api/uploadFiles
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

// DELETE /api/uploadFiles
export async function DELETE(req: NextRequest) {

  try {
    const { files } = await req.json();

    // Delete the files
    const isDeleted = await deleteMediaFiles(files);

    if (!isDeleted.results?.[0]?.success) {
      return NextResponse.json(
        { error: 'Error deleting files' },
        { status: 400 }
      );
    }
   
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
