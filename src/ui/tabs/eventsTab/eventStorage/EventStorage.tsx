import React, { useEffect, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Border,
  Box,
  Button,
  Columns,
  Stack,
  TextInput,
  TypeFace,
  useDialog,
} from '@spooder/webui-component-library';
import useEvents from '../../../../app/hooks/useEvents';
import JsonNodeEditor, { JsonValue } from './JsonNodeEditor';

interface EventStorageProps {
  eventName: string;
}

// What get_*_value/set_*_value graph nodes persist for this event, browsed and edited here as
// a JSON tree. Backed by its own API (EventStorageService), not the graphs form this modal's
// other two pages share - so it loads, saves and deletes independently of the Save button in
// the modal header.
export default function EventStorage(props: EventStorageProps) {
  const { eventName } = props;
  const { getEventStorage, getSetEventStorageValue, getDeleteEventStorageValue } = useEvents();
  const { values, isLoading, error } = getEventStorage(eventName);
  const { setEventStorageValue } = getSetEventStorageValue();
  const { deleteEventStorageValue } = getDeleteEventStorageValue();
  const { openDialog, closeDialog } = useDialog();

  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [draft, setDraft] = useState<JsonValue>('');
  const [isDirty, setIsDirty] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');

  const keys = Object.keys(values ?? {}).sort();

  // Reloads the draft from the fetched value whenever the selected key changes, or the fetch
  // itself changes (e.g. right after this same draft was saved) - but not while the user is
  // still mid-edit on the key that's already selected, which would otherwise stomp their typing
  // on every refetch.
  useEffect(() => {
    if (selectedKey != null && values && Object.prototype.hasOwnProperty.call(values, selectedKey)) {
      setDraft(values[selectedKey]);
      setIsDirty(false);
    }
  }, [selectedKey, values]);

  if (isLoading) {
    return (
      <Box padding='medium'>
        <TypeFace>Loading...</TypeFace>
      </Box>
    );
  }

  if (error) {
    return (
      <Box padding='medium'>
        <TypeFace>Failed to load this event's stored values.</TypeFace>
      </Box>
    );
  }

  function addKey() {
    const key = newKeyName.trim();
    if (key.length === 0 || keys.includes(key)) {
      return;
    }
    setEventStorageValue(eventName, key, '').then((response) => {
      if (!response.error) {
        setNewKeyName('');
        setSelectedKey(key);
      }
    });
  }

  function deleteKey(key: string) {
    openDialog(
      `Delete '${key}'?`,
      <TypeFace>
        {`Any node reading '${key}' will get its default value back instead. This can't be undone.`}
      </TypeFace>,
      [
        <Button label='Cancel' onClick={() => closeDialog()} />,
        <Button
          label='Delete'
          className='delete-button'
          onClick={() => {
            closeDialog();
            deleteEventStorageValue(eventName, key).then(() => {
              if (selectedKey === key) {
                setSelectedKey(null);
              }
            });
          }}
        />,
      ],
    );
  }

  function saveDraft() {
    if (selectedKey == null) {
      return;
    }
    setEventStorageValue(eventName, selectedKey, draft).then((response) => {
      if (!response.error) {
        setIsDirty(false);
      }
    });
  }

  return (
    <Columns spacing='medium' padding='medium' width='100%'>
      <Stack spacing='small' width='220px'>
        <TypeFace fontWeight='bold'>Stored Keys</TypeFace>
        {keys.length === 0 ? <TypeFace fontSize='small'>Nothing stored yet.</TypeFace> : null}
        {keys.map((key) => (
          <Border borderBottom key={key}>
            <Box
              flexFlow='row'
              justifyContent='space-between'
              alignItems='center'
              padding='small'
              onClick={() => setSelectedKey(key)}
            >
              <TypeFace truncate fontWeight={key === selectedKey ? 'bold' : undefined}>
                {key}
              </TypeFace>
              <Button icon={faTrash} onClick={() => deleteKey(key)} />
            </Box>
          </Border>
        ))}
        <Columns spacing='small'>
          <TextInput
            width='100%'
            placeholder='New key'
            value={newKeyName}
            onInput={(value) => setNewKeyName(value)}
            jsonFriendly
          />
          <Button label='Add' onClick={() => addKey()} disabled={newKeyName.trim().length === 0 || keys.includes(newKeyName.trim())} />
        </Columns>
      </Stack>
      <Stack spacing='small' width='100%'>
        {selectedKey == null ? (
          <TypeFace>Select a key to view or edit its contents.</TypeFace>
        ) : (
          <>
            <Columns spacing='small'>
              <TypeFace fontWeight='bold'>{selectedKey}</TypeFace>
              <Button label='Save' onClick={() => saveDraft()} disabled={!isDirty} />
            </Columns>
            <JsonNodeEditor
              value={draft}
              onChange={(value) => {
                setDraft(value);
                setIsDirty(true);
              }}
            />
          </>
        )}
      </Stack>
    </Columns>
  );
}
