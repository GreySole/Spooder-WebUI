import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

interface ImageProps {
  src: string;
  alt?: string;
  fallbackIcon?: any;
}

export default function ImageFile({ src, alt, fallbackIcon = faExclamationTriangle }: ImageProps) {
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    setHasError(true);
  };

  return (
    <>
      {hasError ? (
        <FontAwesomeIcon icon={fallbackIcon} />
      ) : (
        <img src={src} alt={alt} onError={handleError} />
      )}
    </>
  );
}
