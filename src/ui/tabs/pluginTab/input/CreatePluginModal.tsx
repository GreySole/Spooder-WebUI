import React, { useState } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Modal } from '@spooder/webui-component-library';
import CreatePluginModalContent from './CreatePluginModalContent';
import { useFormContext } from 'react-hook-form';
import { usePluginContext } from '../context/PluginTabFormContext';
import usePlugins from '../../../../app/hooks/usePlugins';

interface CreatePluginModalProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

export default function CreatePluginModal(props: CreatePluginModalProps) {
  const { setIsOpen, isOpen } = props;
  const { reset, getValues } = useFormContext();
  const { plugins, newPlugins, setNewPlugins } = usePluginContext();
  const { getCreatePlugin } = usePlugins();
  const { createPlugin } = getCreatePlugin();
  const handleClose = () => {
    reset();
    setIsOpen(false);
  };

  function createPluginClick() {
    const { name, author, description, typescript, pages } = getValues();
    let internalName = name
      .toLowerCase()
      .replaceAll(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/g, '')
      .replaceAll(' ', '_');
    let renameCount = 1;
    if (plugins[internalName] != null) {
      while (plugins[internalName + renameCount] != null) {
        if (plugins[internalName + renameCount] == null) {
          internalName += renameCount;
          break;
        } else {
          renameCount++;
        }
      }
      if (plugins[internalName + renameCount] == null) {
        internalName += renameCount;
      }
    }

    createPlugin(internalName, name, author, description, typescript, pages);

    setNewPlugins({
      ...newPlugins,
      [internalName]: {
        name: name,
        author: author,
        description: description,
        status: 'start',
        message: 'installing...',
      },
    });
    reset();
    setIsOpen(false);
  }

  return (
    <Modal
      isOpen={isOpen}
      title='Create Plugin'
      content={<CreatePluginModalContent />}
      onClose={() => handleClose()}
      footerContent={
        <Box width='100%' justifyContent='flex-end'>
          <Button label='Create' onClick={createPluginClick} />
        </Box>
      }
    />
  );
}
