'use client';

import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload } from 'lucide-react';
import { useVideoStore } from '@/lib/store/video-store';
import { SUPPORTED_VIDEO_FORMATS, MAX_VIDEO_SIZE } from '@/lib/constants';

export function VideoUploader() {
  const { setVideoFile, setVideoUrl } = useVideoStore();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setVideoFile(file);
      setVideoUrl(URL.createObjectURL(file));
    }
  }, [setVideoFile, setVideoUrl]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/*': SUPPORTED_VIDEO_FORMATS,
    },
    maxSize: MAX_VIDEO_SIZE,
    multiple: false,
  });

  return (
    <div
      {...getRootProps()}
      className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors
        ${isDragActive ? 'border-primary bg-primary/5' : 'border-border'}`}
    >
      <input {...getInputProps()} />
      <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">
        {isDragActive ? 'Drop the video here' : 'Drag & drop a video, or click to select'}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        Supported formats: MP4, WebM, MOV (max 1GB)
      </p>
    </div>
  );
}