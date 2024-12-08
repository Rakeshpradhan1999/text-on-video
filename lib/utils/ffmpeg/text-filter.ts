interface TextPosition {
  x: string;
  y: string;
}

export function getTextPosition(position: string): TextPosition {
  switch (position) {
    case 'top':
      return { x: '(w-text_w)/2', y: 'h*0.1' };
    case 'center':
      return { x: '(w-text_w)/2', y: '(h-text_h)/2' };
    case 'bottom':
      return { x: '(w-text_w)/2', y: 'h*0.85' };
    default:
      return { x: '(w-text_w)/2', y: 'h*0.85' };
  }
}

export function getTextAlignment(alignment: string): string {
  switch (alignment) {
    case 'left':
      return 'x=w*0.1';
    case 'right':
      return 'x=w*0.9-text_w';
    default:
      return 'x=(w-text_w)/2';
  }
}

export function createTextFilter(textOverlay: any): string {
  const escapedText = textOverlay.content.replace(/[\\':]/g, '\\$&');
  const escapedAuthor = textOverlay.author.replace(/[\\':]/g, '\\$&');
  const position = getTextPosition(textOverlay.position);
  const fontsize = textOverlay.fontSize;
  const fontcolor = textOverlay.color.replace('#', '0x');
  
  // Main text
  let filter = [
    `drawtext=text='${escapedText}'`,
    `fontsize=${fontsize}`,
    `fontcolor=${fontcolor}`,
    `x=${position.x}`,
    `y=${position.y}`,
    'box=1',
    'boxcolor=black@0.4',
    'boxborderw=5',
    `font='${textOverlay.fontFamily}'`
  ].join(':');
  
  // Author text if present
  if (escapedAuthor) {
    const authorY = textOverlay.position === 'bottom' 
      ? `${position.y}+${fontsize + 10}`
      : `${position.y}+${fontsize + 10}`;
      
    filter += `,drawtext=` + [
      `text='- ${escapedAuthor}'`,
      `fontsize=${Math.floor(fontsize * 0.75)}`,
      `fontcolor=${fontcolor}`,
      'x=(w-text_w)/2',
      `y=${authorY}`,
      'box=1',
      'boxcolor=black@0.4',
      'boxborderw=5',
      `font='${textOverlay.fontFamily}'`
    ].join(':');
  }
  
  return filter;
}