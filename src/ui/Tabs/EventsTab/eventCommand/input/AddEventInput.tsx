import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EVENT_KEY } from '../../FormKeys';
import { useState } from 'react';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';
import { SpooderEvent } from '../../../../Types';
import { Box, Button } from '@greysole/spooder-component-library';

interface AddEventButtonProps {
  groupName: string;
}

export default function AddEventInput(props: AddEventButtonProps) {
  const { groupName } = props;
  const { setValue, watch } = useFormContext();
  const [addEventName, setAddEventName] = useState<string>('');
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const events = watch('events');

  function checkEventTaken(eventName: string) {
    eventName = eventName.replace(/[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/, '').replace(' ', '_');
    if (Object.keys(events).includes(eventName)) {
      return true;
    } else {
      return false;
    }
  }

  function addEvent(newKey: string, eventGroup: string) {
    console.log('NEW EVENT', newKey);
    if (events[newKey] != null) {
      return;
    }

    const newEvent = {
      name: newKey,
      description: '',
      group: eventGroup,
      cooldown: 0,
      chatnotification: false,
      cooldownnotification: false,
      triggers: {
        chat: { enabled: true, command: '!' + newKey },
        twitch: { enabled: false, type: 'redeem', reward: { id: '', override: false } },
        osc: {
          enabled: false,
          address: '/',
          type: 'single',
          condition: '==',
          value: 0,
          condition2: '==',
          value2: 0,
        },
      },
      commands: [],
    } as SpooderEvent;

    setValue(`${EVENT_KEY}.${newKey}`, newEvent);
  }

  return (
    <HotkeysProvider enter={() => (inputFocused ? addEvent(addEventName, groupName) : null)}>
      <Box paddingTop='small' paddingBottom='small' paddingLeft='none'>
        <input
          type='text'
          className={`event-key-input ${checkEventTaken(addEventName) ? 'error' : ''}`}
          id='eventkey'
          placeholder='Event name'
          value={addEventName}
          onInput={(e: React.ChangeEvent<HTMLInputElement>) => setAddEventName(e.target.value)}
          onFocus={() => setInputFocused(true)}
          onBlur={() => setInputFocused(false)}
        />
        <Button
          className='add-button'
          label='Add'
          onClick={() => addEvent(addEventName, groupName)}
        />
      </Box>
    </HotkeysProvider>
  );
}
