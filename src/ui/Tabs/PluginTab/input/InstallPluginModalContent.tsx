import React from 'react';
import { Box, FileDropZone } from '@greysole/spooder-component-library';
import usePlugins from '../../../../app/hooks/usePlugins';
import { usePluginContext } from '../context/PluginTabFormContext';

interface InstallPluginModalContentProps {
  setIsModalOpen: (isOpen: boolean) => void;
}

export default function InstallPluginModalContent({
  setIsModalOpen,
}: InstallPluginModalContentProps) {
  const { getInstallPlugin } = usePlugins();
  const { newPlugins, setNewPlugins } = usePluginContext();
  const { installPlugin } = getInstallPlugin();

  function validateFile(file?: File) {
    if (file !== undefined) {
      setNewPlugins({
        ...newPlugins,
        [file.name]: {
          name: '',
          author: '',
          description: '',
          status: 'start',
          message: 'installing...',
        },
      });
      setIsModalOpen(false);
      installPlugin(file);
    }
  }
  return (
    <Box width='100%' height='100%' flexFlow='column'>
      <FileDropZone width='100%' height='100%' handleFile={(file) => validateFile(file)} />
    </Box>
  );
}
