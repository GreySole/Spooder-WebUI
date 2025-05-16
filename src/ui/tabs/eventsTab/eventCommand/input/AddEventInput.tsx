import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EVENT_KEY } from '../../FormKeys';
import { useState } from 'react';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';
import { SpooderEvent } from '../../../../Types';
import {
  Border,
  Box,
  Button,
  Columns,
  Stack,
  TextInput,
  TypeFace,
  useTheme,
} from '@greysole/spooder-component-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { useEventTableModal } from '../../context/EventTableModalContext';

interface AddEventButtonProps {
  groupName: string;
}

export default function AddEventInput(props: AddEventButtonProps) {
  const { groupName } = props;
  const { setValue, watch } = useFormContext();
  const [addEventName, setAddEventName] = useState<string>('');
  const [inputFocused, setInputFocused] = useState<boolean>(false);
  const [isEventTaken, setIsEventTaken] = useState<boolean>(false);
  const { open, setEventName } = useEventTableModal();
  const { themeColors } = useTheme();
  const events = watch('events');

  function checkEventTaken(eventName: string) {
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
      triggers: {},
      commands: [],
    } as SpooderEvent;

    setValue(`${EVENT_KEY}.${newKey}`, newEvent);
    setEventName(newKey);
    open();
  }

  const onInput = (value: string) => {
    setIsEventTaken(checkEventTaken(value));
    setAddEventName(value);
  };

  return (
    <HotkeysProvider enter={() => (inputFocused ? addEvent(addEventName, groupName) : null)}>
      <Stack spacing='small' padding='medium'>
        {isEventTaken ? (
          <TypeFace color={themeColors.colorAnalogousCW}>
            <span>
              <FontAwesomeIcon icon={faExclamationTriangle} />
            </span>
            <span> Event name already taken</span>
          </TypeFace>
        ) : null}
        <Columns spacing='medium'>
          <TextInput
            placeholder='Add Event'
            value={addEventName}
            onInput={(value) => onInput(value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            jsonFriendly
          />
          <Button label='Add' onClick={() => addEvent(addEventName, groupName)} />
        </Columns>
      </Stack>
    </HotkeysProvider>
  );
}
