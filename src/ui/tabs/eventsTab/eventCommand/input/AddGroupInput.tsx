import React, { useEffect } from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';
import {
  Columns,
  TypeFace,
  TextInput,
  Button,
  Stack,
  useTheme,
  useToast,
} from '@greysole/spooder-component-library';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useEvents from '../../../../../app/hooks/useEvents';

export default function AddGroupInput() {
  const { setValue, getValues, watch } = useFormContext();
  const { getSaveEvents, getEvents } = useEvents();
  const { saveEvents } = getSaveEvents();
  const { refetch } = getEvents();
  const [addGroupName, setAddGroupName] = useState<string>('');
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isGroupTaken, setIsGroupTaken] = useState<boolean>(false);
  const { themeColors } = useTheme();
  const groups = watch('groups');
  const { showError } = useToast();

  useEffect(() => {
    if (isGroupTaken) {
      showError('Group name already taken');
    }
  }, [isGroupTaken]);

  function addGroup(groupName: string) {
    if (isGroupTaken) {
      return;
    }
    const newGroups = [...groups];
    newGroups.push(groupName);
    setValue('groups', newGroups);
    saveEvents(
      getValues(),
      'Group added successfully!',
      'An error occurred while adding the group.',
    ).then(() => {
      refetch();
      setAddGroupName('');
      setIsGroupTaken(false);
      setInputFocused(false);
    });
  }

  function checkGroupTaken(groupName: string) {
    console.log(groupName, groups.includes(groupName));
    if (groups.includes(groupName)) {
      return true;
    } else {
      return false;
    }
  }

  const onInput = (value: string) => {
    setIsGroupTaken(checkGroupTaken(value));
    setAddGroupName(value);
  };

  return (
    <HotkeysProvider enter={() => (inputFocused ? addGroup(addGroupName) : null)}>
      <Stack spacing='small'>
        <Columns spacing='none'>
          <TextInput
            placeholder='Add Group'
            value={addGroupName}
            onInput={(value) => onInput(value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          <Button
            label='Add'
            onClick={() => addGroup(addGroupName)}
            disabled={isGroupTaken || !addGroupName}
            className='merge-with-input'
          />
        </Columns>
      </Stack>
    </HotkeysProvider>
  );
}
