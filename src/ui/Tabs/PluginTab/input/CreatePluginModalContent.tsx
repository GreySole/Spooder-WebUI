import { Stack, TextInput, Button } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import usePlugins from '../../../../app/hooks/usePlugins';
import { usePluginContext } from '../context/PluginTabFormContext';

export default function CreatePluginModalContent() {
  const [createPluginName, setCreatePluginName] = useState('');
  const [createPluginAuthor, setCreatePluginAuthor] = useState('');
  const [createPluginDescription, setCreatePluginDescription] = useState('');
  const { plugins, newPlugins, setNewPlugins } = usePluginContext();
  const { getCreatePlugin } = usePlugins();
  const { createPlugin } = getCreatePlugin();

  function createPluginClick() {
    let internalName = createPluginName
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

    createPlugin(internalName, createPluginName, createPluginAuthor, createPluginDescription);

    setNewPlugins({
      ...newPlugins,
      [internalName]: {
        name: createPluginName,
        author: createPluginAuthor,
        description: createPluginDescription,
        status: 'start',
        message: 'installing...',
      },
    });
    setCreatePluginName('');
    setCreatePluginAuthor('');
    setCreatePluginDescription('');
  }
  return (
    <Stack spacing='medium'>
      <TextInput
        label='Name'
        onInput={(value) => setCreatePluginName(value)}
        value={createPluginName}
      />
      <TextInput
        label='Author'
        onInput={(value) => setCreatePluginAuthor(value)}
        value={createPluginAuthor}
      />
      <TextInput
        label='Description'
        onInput={(value) => setCreatePluginDescription(value)}
        value={createPluginDescription}
      />
      <Button label='Create' onClick={createPluginClick} />
    </Stack>
  );
}
