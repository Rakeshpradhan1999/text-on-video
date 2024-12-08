import VideoEditor from '@/components/video-editor';

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-8 text-4xl font-bold tracking-tight">Video Text Overlay</h1>
        <VideoEditor />
      </div>
    </main>
  );
}