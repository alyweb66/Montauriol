
import sharp from 'sharp';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { toast } from '../components/ui';

export const config = {
  api: {
    bodyParser: false, // Désactivation du body parser pour gérer le multipart/form-data
  },
};

type MediaFile = {
  type: string;
  name: string | null;
  buffer: Buffer;
  size: number;
};

type ImageResponse = {
  url: string;
  thumbnail?: string;
  name: string;
};


// Create a temporary directory if it doesn't exist
const tmpDir = path.join(process.cwd(), 'tmp');
if (!fs.existsSync(tmpDir)) {
  fs.mkdirSync(tmpDir, { recursive: true });
}

// Handle the uploaded files
export async function handleUploadedFiles(
  media: MediaFile[],
  generateThumbnail: boolean
): Promise<ImageResponse[]> {
  
  const processedFiles = await Promise.all(
    media.map(async (file) => {
      const { type, name, buffer } = file;
      if (!name) {
        throw new Error('Name not found');
      }
      // Extract the file name and extension
      const fileNameWithoutExtension = path.parse(name).name;
      const extension = path.extname(name).toLowerCase();

      // Check if the file extension is valid
      const validExtensions = ['.jpg', '.jpeg', '.png', '.pdf'];
      if (!validExtensions.includes(extension)) {
        console.log('Extension invalide');
        
        throw new Error('Bad input file');
      }

      // Normalize the file name
      const normalizedFileName = fileNameWithoutExtension.replace(/\s+/g, '-');
      const uniqueId = crypto.randomBytes(16).toString('hex');

      let uniqueFileName: string;
      let thumbnailFileName: string | undefined;
      if (type.startsWith('image/')) {
        uniqueFileName = `${normalizedFileName}_${uniqueId}.webp`;
        thumbnailFileName = `${normalizedFileName}_${uniqueId}_thumb.webp`;
      } else if (type === 'application/pdf') {
        uniqueFileName = `${normalizedFileName}_${uniqueId}${extension}`;
      } else {
        throw new Error('Bad input file');
      }

      // Destination folder
      const destinationFolder = path.join(process.cwd(), 'public', 'media');
      const filePath = path.join(destinationFolder, uniqueFileName);

      // Generate the thumbnail file path
      let thumbnailFilePath: string | undefined;
      if (
        generateThumbnail &&
        type.startsWith('image/') &&
        thumbnailFileName
      ) {
        thumbnailFilePath = path.join(destinationFolder, thumbnailFileName);
      }

      // Get the buffer of the file
      const fileBuffer = buffer;

      
      if (
        type.startsWith('image/') &&
        fileBuffer.length < Number(process.env.MAX_IMAGE_SIZE)
      ) {
        // Image processing with Sharp
        const image = sharp(fileBuffer)
          .rotate()
          .resize({ width: 1920, withoutEnlargement: true });

        // Save and compress the image
        await image.clone().webp({ quality: 75, effort: 6 }).toFile(filePath);

        // Generate a thumbnail if needed
        if (generateThumbnail && thumbnailFilePath) {
          await image
            .clone()
            .webp({ quality: 1, effort: 6 }) // Bad quality for a placeholder
            .blur(80) // Add blur effect
            .toFile(thumbnailFilePath);
        }
      } else if (
        type === 'application/pdf' &&
        fileBuffer.length < Number(process.env.MAX_PDF_SIZE)
      ) {
        // For pdf files, we just save the buffer
        await fs.promises.writeFile(filePath, fileBuffer);
      } else {
        throw new Error('Bad input file');
      }

      // Build the URL for the image
      const baseUrl = '/media/';
   
      // Return the URL of the image
      const pictureUrl = `${baseUrl}${uniqueFileName}`;
      let thumbnailUrl: string | undefined;
      if (
        generateThumbnail &&
        type.startsWith('image/') &&
        thumbnailFileName
      ) {
        thumbnailUrl = `${baseUrl}${thumbnailFileName}`;
      }

      return {
        url: pictureUrl,
        ...(thumbnailUrl ? { thumbnail: thumbnailUrl } : {}),
        name: uniqueFileName,
      };
    })
  );
  return processedFiles;
}

