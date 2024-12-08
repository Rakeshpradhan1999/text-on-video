'use client';

import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { useVideoStore } from '@/lib/store/video-store';
import {
  FONT_OPTIONS,
  ANIMATION_OPTIONS,
  POSITION_OPTIONS,
  ALIGNMENT_OPTIONS,
} from '@/lib/constants';

interface TextOverlayControlsProps {
  onPreviewUpdate: () => void;
}

export function TextOverlayControls({ onPreviewUpdate }: TextOverlayControlsProps) {
  const { textOverlay, setTextOverlay } = useVideoStore();

  const handleChange = (field: string, value: string | number) => {
    if (field === 'fontSize') {
      const fontSize = parseInt(value.toString(), 10);
      if (isNaN(fontSize)) return;
      value = fontSize;
    }
    setTextOverlay({ [field]: value });
    onPreviewUpdate();
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="content">Text Content</Label>
        <Input
          id="content"
          value={textOverlay.content}
          onChange={(e) => handleChange('content', e.target.value)}
          placeholder="Enter your text here"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="author">Author</Label>
        <Input
          id="author"
          value={textOverlay.author}
          onChange={(e) => handleChange('author', e.target.value)}
          placeholder="Enter author name"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fontFamily">Font Family</Label>
          <Select
            value={textOverlay.fontFamily}
            onValueChange={(value) => handleChange('fontFamily', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select font" />
            </SelectTrigger>
            <SelectContent>
              {FONT_OPTIONS.map((font) => (
                <SelectItem key={font.value} value={font.value}>
                  {font.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="fontSize">Font Size (px)</Label>
          <Input
            id="fontSize"
            type="number"
            min="12"
            max="72"
            value={textOverlay.fontSize.toString()}
            onChange={(e) => handleChange('fontSize', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="color">Text Color</Label>
          <Input
            id="color"
            type="color"
            value={textOverlay.color}
            onChange={(e) => handleChange('color', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="animation">Animation</Label>
          <Select
            value={textOverlay.animation}
            onValueChange={(value) => handleChange('animation', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select animation" />
            </SelectTrigger>
            <SelectContent>
              {ANIMATION_OPTIONS.map((animation) => (
                <SelectItem key={animation.value} value={animation.value}>
                  {animation.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Select
            value={textOverlay.position}
            onValueChange={(value) => handleChange('position', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {POSITION_OPTIONS.map((position) => (
                <SelectItem key={position.value} value={position.value}>
                  {position.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="alignment">Alignment</Label>
          <Select
            value={textOverlay.alignment}
            onValueChange={(value) => handleChange('alignment', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select alignment" />
            </SelectTrigger>
            <SelectContent>
              {ALIGNMENT_OPTIONS.map((alignment) => (
                <SelectItem key={alignment.value} value={alignment.value}>
                  {alignment.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}