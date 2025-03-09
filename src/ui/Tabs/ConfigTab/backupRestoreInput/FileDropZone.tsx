import React, { useState, useEffect, useRef } from 'react';
import { faFileArrowDown, faFileArrowUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Border,
  Box,
  getIcon,
  MouseArea,
  TypeFace,
  useTheme,
} from '@greysole/spooder-component-library';

interface FileDropZoneProps {
  handleFile: (file: File) => void;
}

export default function FileDropZone({ handleFile }: FileDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const { isMobileDevice } = useTheme();
  const [fileDropMessage, setFileDropMessage] = useState(
    isMobileDevice ? 'Click to Browse' : 'Drop File Here',
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFile(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFile(file);
    }
  };

  return (
    <Border borderWidth='4px' borderStyle={isDragging ? 'solid' : 'dashed'}>
      <MouseArea
        onPointerEnter={() => (isDragging ? {} : setFileDropMessage('Click to Browse'))}
        onPointerLeave={() =>
          setFileDropMessage(isMobileDevice ? 'Click to Browse' : 'Drop File Here')
        }
        onDragOver={(e) => handleDragOver(e)}
        onDragLeave={handleDragLeave}
        onDrop={(e) => handleDrop(e)}
      >
        <Box
          flexFlow='column'
          width='100%'
          height='25vh'
          justifyContent='center'
          alignItems='center'
          onClick={handleClick}
        >
          {getIcon(faFileArrowDown, true, '5vh')}
          <TypeFace fontSize='large'>{fileDropMessage}</TypeFace>
          <input
            type='file'
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
            accept='.zip'
          />
        </Box>
      </MouseArea>
    </Border>
  );
}
