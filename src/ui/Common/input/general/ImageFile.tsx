import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ImageProps {
  src: string;
  width?: string;
  height?: string;
  alt?: string;
  fallbackIcon?: any;
  clip?: 'circle' | 'square';
}

export default function ImageFile({
  src,
  width,
  height,
  alt,
  fallbackIcon = faExclamationTriangle,
  clip,
}: ImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  let clipPath = undefined;
  if (clip === 'circle') {
    clipPath = 'circle(50% at 50% 50%)';
  } else if (clip === 'square') {
    clipPath = 'inset(0px round 10%)';
  }

  return (
    <>
      {hasError ? (
        <FontAwesomeIcon icon={fallbackIcon} style={{ width: width, height: height }} />
      ) : (
        <img
          src={src}
          alt={alt}
          style={{ width: width, height: height, clipPath: clipPath }}
          onError={handleError}
        />
      )}
    </>
  );
}
