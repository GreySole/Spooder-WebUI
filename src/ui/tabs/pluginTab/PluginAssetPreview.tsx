import React, { useRef, useEffect } from 'react';
import { getMediaType, getMediaHTML, Box, ImageFile } from '@greysole/spooder-component-library';

interface PluginAssetPreviewProps {
  assetFilePreview: string;
  assetPath: string;
}

export default function PluginAssetPreview({
  assetFilePreview,
  assetPath,
}: PluginAssetPreviewProps) {
  const audioPreviewRef = useRef<HTMLMediaElement>(null);

  function pathJoin(...segments: string[]) {
    return segments.join('/');
  }

  let previewHTML = null;
  let previewAudio = null;

  if (assetFilePreview != null) {
    const previewMediaType = getMediaType(assetFilePreview);
    if (previewMediaType == 'sound') {
      previewAudio = pathJoin(assetPath, assetFilePreview);
      previewHTML = null;
    } else if (previewMediaType == 'image') {
      previewAudio = null;
      previewHTML = getMediaHTML(pathJoin(assetPath, assetFilePreview));
      previewHTML = (
        <ImageFile
          width='100%'
          height='100%'
          src={pathJoin(assetPath, assetFilePreview)}
          objectFit='contain'
        />
      );
    }
  }

  // Handle audio source changes
  useEffect(() => {
    if (audioPreviewRef.current && previewAudio) {
      audioPreviewRef.current.load();
    }
  }, [previewAudio]);

  return (
    <Box width='100%' height='100%' alignItems='center' padding='small'>
      {previewHTML}
      <audio
        id='audioPreview'
        ref={audioPreviewRef}
        controls
        key={previewAudio || 'no-audio'} // Force re-render when audio source changes
      >
        {previewAudio ? <source src={previewAudio}></source> : null}
      </audio>
    </Box>
  );
}
