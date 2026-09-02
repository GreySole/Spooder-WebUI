import {
  BoolSwitch,
  Border,
  Box,
  Button,
  Columns,
  Stack,
  TextInput,
  TypeFace,
  useToast,
} from '@spooder/webui-component-library';
import React, { useState } from 'react';
import {
  RegistrySource,
  useAddSourceMutation,
  useRemoveSourceMutation,
  useSetSourceEnabledMutation,
} from '../../../app/api/registrySlice';

// Where a registry came from decides whether its entries can be trusted, so this is deliberately
// plain: which lists are on, what they last returned, and what went wrong if anything did.
export default function RegistrySources({ sources }: { sources: RegistrySource[] }) {
  const [newUrl, setNewUrl] = useState('');
  const [addSource, { isLoading: adding }] = useAddSourceMutation();
  const [removeSource] = useRemoveSourceMutation();
  const [setEnabled] = useSetSourceEnabledMutation();
  const { showSuccess, showError } = useToast();

  const add = async () => {
    if (newUrl.trim().length === 0) {
      return;
    }
    const result: any = await addSource({ url: newUrl.trim() });
    if (result?.error) {
      // The backend writes these for the person pasting the URL, so show them as they are.
      showError(result.error.data?.error ?? 'Could not add that registry.');
      return;
    }
    showSuccess('Registry added.');
    setNewUrl('');
  };

  const remove = async (source: RegistrySource) => {
    const result: any = await removeSource({ id: source.id });
    if (result?.error) {
      showError(result.error.data?.error ?? 'Could not remove that registry.');
      return;
    }
    showSuccess(`Removed ${source.name}.`);
  };

  return (
    <Stack spacing="medium" width="100%">
      <TypeFace fontSize="large">Registries</TypeFace>
      <TypeFace fontSize="medium">
        Lists of modules and plugins Spooder can install. Adding one means trusting whoever
        maintains it — anything you install from it runs on this machine.
      </TypeFace>

      {sources.map((source) => (
        <Border key={source.id}>
          <Box padding="small" width="100%">
            <Stack spacing="small" width="100%">
              <Columns spacing="small">
                <BoolSwitch
                  value={source.enabled}
                  onChange={(enabled: boolean) => setEnabled({ id: source.id, enabled })}
                  label={source.name}
                />
                {!source.official && (
                  <Button label="Remove" onClick={() => remove(source)} />
                )}
              </Columns>
              <TypeFace fontSize="medium">{source.url}</TypeFace>
              {source.error ? (
                <TypeFace fontSize="medium">
                  Couldn't be reached — {source.error}
                  {(source.entryCount ?? 0) > 0 ? ' Showing the last copy Spooder downloaded.' : ''}
                </TypeFace>
              ) : (
                <TypeFace fontSize="medium">
                  {source.entryCount ?? 0} {source.entryCount === 1 ? 'entry' : 'entries'}
                  {source.official ? ' · built in' : ''}
                </TypeFace>
              )}
            </Stack>
          </Box>
        </Border>
      ))}

      <Columns spacing="small">
        <TextInput
          value={newUrl}
          onChange={(value: string) => setNewUrl(value)}
          placeholder="owner/repo or https://…/index.json"
        />
        <Button label={adding ? 'Adding…' : 'Add registry'} onClick={add} />
      </Columns>
    </Stack>
  );
}
