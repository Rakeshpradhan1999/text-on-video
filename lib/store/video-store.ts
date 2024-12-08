import { create } from 'zustand';

export interface TextOverlay {
  content: string;
  author: string;
  fontFamily: string;
  fontSize: number;
  color: string;
  animation: 'fade' | 'slide' | 'typewriter' | 'bounce';
  position: 'top' | 'center' | 'bottom';
  alignment: 'left' | 'center' | 'right';
}

interface VideoState {
  videoUrl: string | null;
  videoFile: File | null;
  textOverlay: TextOverlay;
  processing: boolean;
  progress: number;
  setVideoUrl: (url: string) => void;
  setVideoFile: (file: File) => void;
  setTextOverlay: (overlay: Partial<TextOverlay>) => void;
  setProcessing: (processing: boolean) => void;
  setProgress: (progress: number) => void;
}

export const useVideoStore = create<VideoState>((set) => ({
  videoUrl: null,
  videoFile: null,
  textOverlay: {
    content: '',
    author: '',
    fontFamily: 'Inter',
    fontSize: 24,
    color: '#ffffff',
    animation: 'fade',
    position: 'bottom',
    alignment: 'center',
  },
  processing: false,
  progress: 0,
  setVideoUrl: (url) => set({ videoUrl: url }),
  setVideoFile: (file) => set({ videoFile: file }),
  setTextOverlay: (overlay) =>
    set((state) => ({
      textOverlay: { ...state.textOverlay, ...overlay },
    })),
  setProcessing: (processing) => set({ processing }),
  setProgress: (progress) => set({ progress }),
}));