import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { GRAPH_KEY, buildGraphKey } from '../../FormKeys';
import { useState } from 'react';
import { HotkeysProvider } from '../../../../../app/hooks/useHotkeys';
import { EventGraph } from '../../../../Types';
import {
  Border,
  Box,
  Button,
  Columns,
  Stack,
  TextInput,
  TypeFace,
  useTheme,
  useToast,
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
  const graphs = watch(GRAPH_KEY);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    if (isEventTaken) {
      showError('Event name already taken');
    }
  }, [isEventTaken]);

  function checkEventTaken(eventName: string) {
    if (Object.keys(graphs).includes(eventName)) {
      return true;
    } else {
      return false;
    }
  }

  function addEvent(newKey: string, eventGroup: string) {
    if (graphs[newKey] != null) {
      return;
    }

    const newGraph: EventGraph = {
      name: newKey,
      description: '',
      group: eventGroup,
      cooldown: 0,
      chatnotification: false,
      cooldownnotification: false,
      nodes: [],
      edges: [],
    };

    setValue(buildGraphKey(newKey), newGraph);
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
        <Columns spacing='none'>
          <TextInput
            placeholder='Add Event'
            value={addEventName}
            onInput={(value) => onInput(value)}
            onFocus={() => setInputFocused(true)}
            onBlur={() => setInputFocused(false)}
            jsonFriendly
          />
          <Button label='Add' onClick={() => addEvent(addEventName, groupName)} disabled={isEventTaken || !addEventName} className='merge-with-input'/>
        </Columns>
      </Stack>
    </HotkeysProvider>
  );
}
