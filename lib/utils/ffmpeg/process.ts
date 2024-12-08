'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { initFFmpeg } from './init';
import { createTextFilter } from './text-filter';

export async function processVideo(
  videoFile: File,
  textOverlay: any,
  setProgress: (progress: number) => void
): Promise<Blob> {
  let ffmpeg: FFmpeg;
  
  try {
    ffmpeg = await initFFmpeg(setProgress);
  } catch (error) {
    console.error('FFmpeg initialization failed:', error);
    throw new Error('Failed to initialize video processor');
  }
  
  try {
    // Write input file
    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));
    
    // Create text overlay filter
    const textFilter = createTextFilter(textOverlay);
    
    // Process video with optimized settings
    await ffmpeg.exec([
      '-i', 'input.mp4',
      '-vf', textFilter,
      '-c:v', 'libx264',
      '-preset', 'medium',
      '-crf', '23',
      '-c:a', 'aac',
      '-b:a', '128k',
      '-movflags', '+faststart',
      '-y',
      'output.mp4'
    ]);
    
    // Read output file
    const data = await ffmpeg.readFile('output.mp4');
    
    if (!(data instanceof Uint8Array)) {
      throw new Error('Failed to read processed video');
    }
    
    // Clean up
    await ffmpeg.deleteFile('input.mp4');
    await ffmpeg.deleteFile('output.mp4');
    
    return new Blob([data.buffer], { type: 'video/mp4' });
    
  } catch (error) {
    console.error('Video processing failed:', error);
    throw new Error('Failed to process video');
  }
}