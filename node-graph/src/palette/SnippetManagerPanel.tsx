import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, Stack, TypeFace, useDialog } from '@spooder/webui-component-library';
import React from 'react';
import { useSnippets } from '../host';

interface SnippetManagerPanelProps {
  onClose: () => void;
}

// Snippets are global, like timers - managed in one place rather than per event. Mirrors
// TimerManagerPanel's shape; unlike a timer, deleting one touches nothing already on a canvas,
// since importing a snippet copies its nodes rather than referencing it live.
export default function SnippetManagerPanel(props: SnippetManagerPanelProps) {
  const { onClose } = props;
  const { openDialog, closeDialog } = useDialog();
  const { getSnippets, getDeleteSnippet } = useSnippets();
  const { snippets, isLoading } = getSnippets();
  const { deleteSnippet } = getDeleteSnippet();

  function confirmDelete(id: string, name: string) {
    openDialog(
      `Delete snippet '${name}'?`,
      <TypeFace>
        This only removes it from the Snippets menu - nodes already imported from it on any
        canvas are unaffected.
      </TypeFace>,
      [
        <Button label='Cancel' onClick={() => closeDialog()} />,
        <Button
          label='Delete'
          className='delete-button'
          onClick={() => {
            deleteSnippet(id);
            closeDialog();
          }}
        />,
      ],
    );
  }

  return (
    <Stack spacing='medium' padding='medium'>
      <Box justifyContent='space-between' alignItems='center'>
        <TypeFace fontSize='large'>Snippets</TypeFace>
        <Button label='Close' onClick={onClose} />
      </Box>

      {!isLoading && (!snippets || snippets.length === 0) ? (
        <TypeFace>
          No snippets yet. Select some nodes on a canvas, right click, and Save As Snippet.
        </TypeFace>
      ) : null}

      {(snippets ?? []).map((snippet) => (
        <Stack key={snippet.id} spacing='small'>
          <Box justifyContent='space-between' alignItems='center'>
            <TypeFace fontWeight='bold'>{snippet.name}</TypeFace>
            {snippet.builtIn ? (
              <TypeFace fontSize='medium'>Built-in</TypeFace>
            ) : (
              <Button
                icon={faTrash}
                className='delete-button'
                onClick={() => confirmDelete(snippet.id, snippet.name)}
              />
            )}
          </Box>

          {snippet.description ? <TypeFace fontSize='medium'>{snippet.description}</TypeFace> : null}

          <TypeFace fontSize='medium'>
            {snippet.nodes.length} node{snippet.nodes.length === 1 ? '' : 's'}
          </TypeFace>
        </Stack>
      ))}
    </Stack>
  );
}
