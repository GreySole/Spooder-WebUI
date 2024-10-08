import React, { useRef } from 'react';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import usePlugins from '../../../../../app/hooks/usePlugins';

interface FileInputProps {
  label?: string;
  fileType: string;
  onChange: (files: FileList) => void;
}

export default function FileInput(props: FileInputProps) {
  const { label, fileType, onChange } = props;
  const acceptedFormat = fileType != null ? fileType + '/*' : '*';
  const fileRef = useRef<HTMLInputElement>(null);

  function handleClick() {
    if (fileRef.current) {
      fileRef.current.click();
    }
  }

  return (
    <label>
      {label}
      <button className='settings-form-asset-upload' onClick={handleClick}>
        <FontAwesomeIcon icon={faFileImport} size='lg' />
      </button>
      <input
        type='file'
        id={'input-file-' + label}
        ref={fileRef}
        accept={acceptedFormat}
        onChange={(e) => {
          if (e.target.files !== null && e.target.files.length > 0) {
            onChange(e.target.files);
          }
        }}
        style={{ display: 'none' }}
      />
    </label>
  );
}
