'use client';

import { useEffect, useRef } from 'react';
import { useVideoStore } from '@/lib/store/video-store';

export function VideoPreview() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { videoUrl, textOverlay } = useVideoStore();

  useEffect(() => {
    if (videoRef.current && videoUrl) {
      videoRef.current.src = videoUrl;
    }
  }, [videoUrl]);

  const getTextStyle = () => {
    const baseStyle = {
      fontFamily: textOverlay.fontFamily,
      fontSize: `${textOverlay.fontSize}px`,
      color: textOverlay.color,
      textAlign: textOverlay.alignment as 'left' | 'center' | 'right',
    };

    let positionStyle = {};
    if (textOverlay.position === 'top') {
      positionStyle = { top: '10%' };
    } else if (textOverlay.position === 'center') {
      positionStyle = { top: '50%', transform: 'translateY(-50%)' };
    } else {
      positionStyle = { bottom: '10%' };
    }

    return { ...baseStyle, ...positionStyle };
  };

  const getAnimationClass = () => {
    switch (textOverlay.animation) {
      case 'fade':
        return 'animate-fade-in';
      case 'slide':
        return 'animate-slide-in';
      case 'typewriter':
        return 'animate-typewriter';
      case 'bounce':
        return 'animate-bounce';
      default:
        return '';
    }
  };

  return (
    <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
      {videoUrl ? (
        <>
          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            playsInline
          />
          <div
            className={`absolute w-full px-6 ${getAnimationClass()}`}
            style={getTextStyle()}
          >
            <p className="text-shadow-lg">{textOverlay.content}</p>
            {textOverlay.author && (
              <p className="text-shadow-lg mt-2 text-sm opacity-75">
                - {textOverlay.author}
              </p>
            )}
          </div>
        </>
      ) : (
        <div className="flex items-center justify-center h-full text-muted-foreground">
          Upload a video to preview
        </div>
      )}
    </div>
  );
}