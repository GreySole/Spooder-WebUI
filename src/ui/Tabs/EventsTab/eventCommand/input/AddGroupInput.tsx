import React from 'react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';
import { Columns, TypeFace, TextInput, Button } from '@greysole/spooder-component-library';

export default function AddGroupInput() {
  const { setValue, getValues } = useFormContext();
  const [addGroupName, setAddGroupName] = useState<string>('');
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  function addGroup(groupName: string) {
    const groups = getValues('groups');
    groups.push(groupName);
    setValue('groups', groups);
  }
  return (
    <HotkeysProvider enter={() => (inputFocused ? addGroup(addGroupName) : null)}>
      <Columns spacing='small' padding='small'>
        <TypeFace>Add Group</TypeFace>
        <TextInput value={addGroupName} onInput={(value) => setAddGroupName(value)} />
        <Button label='Add' onClick={() => addGroup(addGroupName)} />
      </Columns>
    </HotkeysProvider>
  );
}
