'use client';

import { useCallback, useState } from 'react';
import { VideoUploader } from './video-uploader';
import { TextOverlayControls } from './text-overlay-controls';
import { VideoPreview } from './video-preview';
import { Button } from './ui/button';
import { useVideoStore } from '@/lib/store/video-store';
import { Card } from './ui/card';
import { Progress } from './ui/progress';
import { processVideo } from '@/lib/utils/ffmpeg';
import { Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function VideoEditor() {
  const {
    videoFile,
    textOverlay,
    processing,
    progress,
    setProcessing,
    setProgress,
  } = useVideoStore();
  const [previewKey, setPreviewKey] = useState(0);
  const [processedVideoUrl, setProcessedVideoUrl] = useState<string | null>(
    null
  );
  const { toast } = useToast();

  const handleProcessVideo = useCallback(async () => {
    if (!videoFile) {
      toast({
        title: 'No video selected',
        description: 'Please upload a video first.',
        variant: 'destructive',
      });
      return;
    }

    if (!textOverlay.content) {
      toast({
        title: 'No text content',
        description: 'Please enter some text to overlay.',
        variant: 'destructive',
      });
      return;
    }

    try {
      setProcessing(true);
      setProgress(0);

      // Revoke previous URL to prevent memory leaks
      if (processedVideoUrl) {
        URL.revokeObjectURL(processedVideoUrl);
      }

      const processedBlob = await processVideo(
        videoFile,
        textOverlay,
        setProgress
      );

      const url = URL.createObjectURL(processedBlob);
      setProcessedVideoUrl(url);

      toast({
        title: 'Success!',
        description: 'Video processed successfully. Click Download to save.',
      });
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: 'Processing failed',
        description:
          error instanceof Error
            ? error.message
            : 'Failed to process video. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  }, [
    videoFile,
    textOverlay,
    processedVideoUrl,
    setProcessing,
    setProgress,
    toast,
  ]);

  const handleDownload = useCallback(() => {
    if (!processedVideoUrl) return;

    const a = document.createElement('a');
    a.href = processedVideoUrl;
    a.download = `processed-video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }, [processedVideoUrl]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="space-y-6">
        <Card className="p-6">
          <VideoUploader />
        </Card>

        <Card className="p-6">
          <TextOverlayControls
            onPreviewUpdate={() => setPreviewKey((prev) => prev + 1)}
          />
        </Card>

        <div className="flex gap-4">
          <Button
            className="flex-1"
            size="lg"
            onClick={handleProcessVideo}
            disabled={!videoFile || processing}
          >
            {processing ? 'Processing...' : 'Process Video'}
          </Button>

          {processedVideoUrl && (
            <Button
              className="flex gap-2"
              size="lg"
              variant="secondary"
              onClick={handleDownload}
            >
              <Download className="h-4 w-4" />
              Download
            </Button>
          )}
        </div>

        {processing && (
          <div className="space-y-2">
            <Progress value={progress} />
            <p className="text-sm text-muted-foreground text-center">
              Processing video: {Math.round(progress)}%
            </p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <Card className="p-6">
          <VideoPreview key={previewKey} />
        </Card>
      </div>
    </div>
  );
}
