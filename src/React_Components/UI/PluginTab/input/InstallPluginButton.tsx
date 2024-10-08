import React from 'react';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import Button from '../../common/input/controlled/Button';
import { useRef } from 'react';
import usePlugins from '../../../../app/hooks/usePlugins';

export default function InstallPluginButton() {
  const hiddenFileInput = useRef<HTMLInputElement>(null);
  const { getInstallPlugin } = usePlugins();
  const { installPlugin } = getInstallPlugin();

  function validateFile(file?: File) {
    if (file !== undefined) {
      installPlugin(file);
    }
  }

  function handleFileClick() {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
  }

  return (
    <>
      <Button label='Install Plugin' onClick={handleFileClick} icon={faFileImport} iconSize='lg' />
      <input
        type='file'
        id='input-file'
        ref={hiddenFileInput}
        onChange={(e) => validateFile(e?.target?.files?.[0])}
        style={{ display: 'none' }}
      />
    </>
  );
}
