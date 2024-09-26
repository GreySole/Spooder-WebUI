import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';

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
    <HotkeysProvider enter={() => inputFocused ? addGroup(addGroupName) : null}>
      <div className='event-add field-section'>
        <label>Add Group</label>
        <div className='add-command-actions'>
          <input
            type='text'
            className='group-name-input'
            name='groupname'
            value={addGroupName}
            onInput={(e: React.ChangeEvent<HTMLInputElement>) => setAddGroupName(e.target.value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
          />
          <button
            type='button'
            id='addGroupButton'
            className='add-button'
            onClick={() => addGroup(addGroupName)}
          >
            Add
          </button>
        </div>
      </div>
    </HotkeysProvider>

  );
}
