import fs from 'fs/promises';
import path from 'path';

export async function deleteMediaFiles(urls: string[]) {
  // path to the media directory
  const mediaDir = path.join(process.cwd(), 'public', 'media');

  try {
    const operations = urls.map(async (url) => {
      // Extract the filename from the URL
      const filename = url.split('/').pop() || '';

      // Check if the filename is valid and doesn't contain '..' to prevent directory traversal
      if (!filename || filename.includes('..')) {
        return {
          success: false,
          filename,
          error: 'Filename not found or invalid',
        };
      }

      // Make path to the file
      const filePath = path.join(mediaDir, filename);

      try {
        // Check if the file exists
        await fs.access(filePath);
        // Delete the file
        await fs.unlink(filePath);

        return { success: true, filename };
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
          return { success: false, filename, error: 'File not found' };
        }
        console.error(`Error with ${filename}:`, error);
        return { success: false, filename, error: (error as Error).message };
      }
    });

    const results = await Promise.all(operations);

    return { results };
  } catch (error) {
    console.error('Global error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
