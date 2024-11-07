import React from 'react';

interface MediaExtensions {
  [key: string]: string[];
}

export const mediaExtensions: MediaExtensions = {
  image: [
    '.jpg',
    '.jpeg',
    '.png',
    '.tif',
    '.webp',
    '.svg',
    '.gif',
    '.xbm',
    '.jfif',
    '.ico',
    '.svgz',
    '.bmp',
    '.pjp',
    '.apng',
    '.pjpeg',
    '.avif',
  ],
  sound: [
    '.wav',
    '.mp3',
    '.aiff',
    '.ogg',
    '.opus',
    '.flac',
    '.webm',
    '.weba',
    '.m4a',
    '.oga',
    '.mid',
    '.aiff',
    '.wma',
    '.au',
  ],
  audio: [
    '.wav',
    '.mp3',
    '.aiff',
    '.ogg',
    '.opus',
    '.flac',
    '.webm',
    '.weba',
    '.m4a',
    '.oga',
    '.mid',
    '.aiff',
    '.wma',
    '.au',
  ],
  video: ['.mp4', '.webm', '.ogm', '.wmv', '.mpg', '.ogv', '.mov', '.asx', '.mpeg', '.m4v', '.avi'],
};

export function getMediaHTML(filePath: string) {
  switch (getMediaType(filePath)) {
    case 'image':
      return <img src={filePath} />;
    case 'sound':
      return <source src={filePath} />;
    case 'video':
      return (
        <video controls>
          <source src={filePath} />
        </video>
      );
  }
}

export function getMediaType(file: string) {
  for (let type in mediaExtensions) {
    for (let ext in mediaExtensions[type]) {
      if (file.toLowerCase().endsWith(mediaExtensions[type][ext])) {
        return type;
      }
    }
  }
  return null;
}
