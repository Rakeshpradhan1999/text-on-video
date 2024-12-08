'use client';

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { toBlobURL, fetchFile } from '@ffmpeg/util';

let ffmpeg: FFmpeg | null = null;

export async function initFFmpeg(setProgress: (progress: number) => void) {
  if (ffmpeg) return ffmpeg;

  try {
    ffmpeg = new FFmpeg();

    ffmpeg.on('progress', ({ progress }) => {
      setProgress(Math.round(progress * 100));
    });

    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        'application/wasm'
      ),
    });

    return ffmpeg;
  } catch (error) {
    console.error('FFmpeg initialization error:', error);
    ffmpeg = null;
    throw error;
  }
}

export async function processVideo(
  videoFile: File,
  textOverlay: TextOverlay, // Use the interface
  setProgress: (progress: number) => void
): Promise<Blob> {
  try {
    const ffmpeg = await initFFmpeg(setProgress);
    console.log(ffmpeg.loaded);
    // Validate input
    if (!videoFile || !textOverlay.content) {
      throw new Error(
        'Invalid input: Video file and text content are required'
      );
    }

    await ffmpeg.writeFile('input.mp4', await fetchFile(videoFile));

    const textFilter = createTextFilter(textOverlay);

    await ffmpeg.exec([
      '-i',
      'input.mp4',
      '-vf',
      textFilter,
      '-c:v',
      'libx264',
      '-preset',
      'fast',
      '-crf',
      '23',
      '-c:a',
      'aac',
      '-strict',
      'experimental',
      '-f',
      'mp4',
      '-movflags',
      '+faststart',
      'output.mp4',
    ]);

    const data = await ffmpeg.readFile('output.mp4');

    if (!(data instanceof Uint8Array)) {
      throw new Error('Failed to read processed video');
    }

    // Optional: Add a size check
    if (data.byteLength === 0) {
      throw new Error('Processed video is empty');
    }

    await ffmpeg.deleteFile('input.mp4');

    return new Blob([data.buffer], { type: 'video/mp4' });
  } catch (error) {
    console.error('Video processing error:', error);
    throw error;
  } finally {
    // Consider cleaning up output file if it exists
    try {
      await ffmpeg?.deleteFile('output.mp4');
    } catch {}
  }
}
interface TextOverlay {
  content: string;
  author?: string;
  position: 'top' | 'center' | 'bottom';
  fontSize: number;
  color: string;
  alignment: 'left' | 'center' | 'right';
}
function createTextFilter(textOverlay: TextOverlay): string {
  // More robust escaping
  const escapeFFmpegString = (str: string) =>
    str.replace(/([\\':;])/g, '\\$1').replace(/\n/g, ' ');

  const escapedText = escapeFFmpegString(textOverlay.content);
  const escapedAuthor = textOverlay.author
    ? escapeFFmpegString(textOverlay.author)
    : '';

  const position = getTextPosition(textOverlay.position);
  const fontsize = Math.max(10, Math.min(textOverlay.fontSize, 100)); // Sanity check font size
  const fontcolor = textOverlay.color.replace('#', '0x');
  const alignment = getTextAlignment(textOverlay.alignment);

  let filter = `drawtext=text='${escapedText}':fontsize=${fontsize}:fontcolor=${fontcolor}:${position}:${alignment}:box=1:boxcolor=black@0.4:boxborderw=5`;

  if (textOverlay.author) {
    const authorY =
      textOverlay.position === 'bottom'
        ? `${position.split(':')[1].split('*')[0]}*0.9+${fontsize + 10}`
        : `${position.split(':')[1]}+${fontsize + 10}`;

    filter += `,drawtext=text='- ${escapedAuthor}':fontsize=${Math.floor(
      fontsize * 0.75
    )}:fontcolor=${fontcolor}:x=(w-text_w)/2:y=${authorY}:box=1:boxcolor=black@0.4:boxborderw=5`;
  }

  return filter;
}
function getTextPosition(position: string): string {
  switch (position) {
    case 'top':
      return 'x=(w-text_w)/2:y=h*0.1';
    case 'center':
      return 'x=(w-text_w)/2:y=(h-text_h)/2';
    default: // bottom
      return 'x=(w-text_w)/2:y=h*0.85';
  }
}

function getTextAlignment(alignment: string): string {
  switch (alignment) {
    case 'left':
      return 'x=w*0.1';
    case 'right':
      return 'x=w*0.9-text_w';
    default: // center
      return 'x=(w-text_w)/2';
  }
}
