import React, { useState } from 'react';
import { Box, Button, Modal, Stack, TextInput, TypeFace } from '@spooder/webui-component-library';

interface SaveSnippetModalProps {
  isOpen: boolean;
  nodeCount: number;
  onSave: (name: string, description: string) => void;
  onClose: () => void;
}

// The name/description prompt behind the context menu's 'Save As Snippet' - the only input a
// snippet needs beyond the nodes and edges already selected on the canvas.
export default function SaveSnippetModal(props: SaveSnippetModalProps) {
  const { isOpen, nodeCount, onSave, onClose } = props;
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  function close() {
    setName('');
    setDescription('');
    onClose();
  }

  function save() {
    const trimmed = name.trim();
    if (!trimmed) {
      return;
    }
    onSave(trimmed, description.trim());
    close();
  }

  return (
    <Modal
      title='Save As Snippet'
      isOpen={isOpen}
      onClose={close}
      content={
        <Stack spacing='medium' paddingTop='medium'>
          <TypeFace fontSize='medium'>
            Saves the selected {nodeCount === 1 ? 'node' : `${nodeCount} nodes`} - and the wires
            between them - as a snippet you can drop into any event's graph from the Snippets
            menu.
          </TypeFace>
          <TextInput width='100%' label='Name:' value={name} onInput={setName} autoFocus />
          <TextInput
            width='100%'
            label='Description (optional):'
            value={description}
            onInput={setDescription}
          />
        </Stack>
      }
      footerContent={
        <Box flexFlow='row' justifyContent='end'>
          <Button label='Cancel' onClick={close} />
          <Button label='Save Snippet' onClick={save} disabled={!name.trim()} />
        </Box>
      }
    />
  );
}
