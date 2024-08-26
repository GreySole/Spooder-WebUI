import { useFormContext } from 'react-hook-form';
import { EVENT_KEY } from '../../FormKeys';
import { useState } from 'react';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';

interface AddEventButtonProps {
  groupName: string;
}

export default function AddEventInput(props: AddEventButtonProps) {
  const { groupName } = props;
  const { setValue, getValues, watch } = useFormContext();
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
    if (events[newKey] != null) {
      return;
    }

    let newEvent = {
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
    } as unknown as Event;

    setValue(`${EVENT_KEY}.${newKey}`, newEvent);
  }

  return (
    <HotkeysProvider enter={()=>inputFocused ? addEvent(addEventName, groupName): null}>
      <input
        type='text'
        className={`event-key-input ${checkEventTaken(addEventName) ? 'error' : ''}`}
        id='eventkey'
        placeholder='Event name'
        value={addEventName}
        onInput={() => setAddEventName(addEventName)}
        onFocus={()=>setInputFocused(true)}
        onBlur={()=>setInputFocused(false)}
      />
      <button
        type='button'
        id='addEventButton'
        className='add-button'
        onClick={() => addEvent(addEventName, groupName)}
      >
        Add
      </button>
    </HotkeysProvider>
  );
}
