import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import SvgIcon from '../icons/SvgIcon';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { StyleSize } from '../Types';

interface MediaExtensions {
  [key: string]: string[];
}

export function getIcon(icon: IconProp | string, isDarkTheme: boolean, size?: string) {
  size = size ? (size in StyleSize ? StyleSize[size as keyof typeof StyleSize] : size) : '2rem';
  if (typeof icon === 'object' && 'icon' in icon) {
    // If icon is a FontAwesome icon prop
    return <FontAwesomeIcon icon={icon} style={{ width: size, height: size }} />;
  } else if (typeof icon === 'string') {
    if (icon.endsWith('.svg')) {
      // If icon is a React component
      return (
        <SvgIcon fill={isDarkTheme ? 'white' : 'black'} width={size} height={size} src={icon} />
      );
    }
    // If icon is a string (URL)
    return <img src={icon} width={size} height={size} />;
  } else {
    return null; // or handle the error case as needed
  }
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
