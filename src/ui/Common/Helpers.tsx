import React from 'react';
import { FieldValues } from 'react-hook-form';
export function $(selector: string) {
  return document.querySelector(selector);
}

export function convertReactFormToFormData(form: FieldValues) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(form)) {
    formData.append(key, value);
  }
  return formData;
}

export function setClass(el: Element | null, classname: string, bool: boolean) {
  if (el === null) {
    return;
  }
  if (bool == null) {
    bool = true;
  }
  if (bool) {
    el.classList.add(classname);
  } else {
    el.classList.remove(classname);
  }
}

export function toggleClass(el: Element | null, classname: string) {
  if (el === null) {
    return;
  }
  let hasClass = el.classList.contains(classname);
  if (hasClass) {
    el.classList.remove(classname);
  } else {
    el.classList.add(classname);
  }
  return el.classList.contains(classname);
}

export function radioClass(classname: string, selector: string, selected: Element | null) {
  if (selected === null) {
    return;
  }
  let selectGroup = document.querySelectorAll(selector);
  selectGroup.forEach((e, i) => {
    e.classList.remove(classname);
  });

  selected.classList.add(classname);
}

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
