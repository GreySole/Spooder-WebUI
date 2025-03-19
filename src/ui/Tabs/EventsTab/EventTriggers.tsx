import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import TwitchTriggerType from './eventTrigger/twitch/TwitchTriggerType';
import ChatTrigger from './eventTrigger/chat/ChatTrigger';
import OSCTrigger from './eventTrigger/osc/OSCTrigger';
import { EVENT_KEY } from './FormKeys';
import TwitchTrigger from './eventTrigger/twitch/TwitchTrigger';
import { Box, Button, SelectDropdown, Stack } from '@greysole/spooder-component-library';

interface EventTriggersProps {
  eventName: string;
}

export default function EventTriggers(props: EventTriggersProps) {
  const { eventName } = props;
  const { watch, setValue } = useFormContext();
  const [addTriggerType, setAddTriggerType] = useState<string>('');
  const eventTriggers = watch(`${EVENT_KEY}.${eventName}.triggers`, {});

  const triggerElements = [];
  for (const t in eventTriggers) {
    switch (t) {
      case 'chat':
        triggerElements.push(<ChatTrigger eventName={eventName} />);
        break;
      case 'osc':
        triggerElements.push(<OSCTrigger eventName={eventName} />);
        break;
      case 'twitch':
        triggerElements.push(<TwitchTrigger eventName={eventName} />);
        break;
    }
  }

  const triggerOptions = [
    { label: 'Select Trigger', value: '' },
    { label: 'Chat', value: 'chat' },
    { label: 'Twitch', value: 'twitch' },
    { label: 'OSC', value: 'osc' },
  ];

  const addTrigger = () => {
    const newTrigger = {
      enabled: true,
    };
    setValue(`${EVENT_KEY}.${eventName}.triggers.${addTriggerType}`, newTrigger);
  };

  return (
    <Box>
      <Stack spacing='medium'>
        <Box flexFlow='row wrap'>
          <SelectDropdown
            label='Add Trigger'
            options={triggerOptions}
            value={addTriggerType}
            onChange={(value) => {
              setAddTriggerType(value);
            }}
          />
          <Box padding='medium'>
            <Button
              label='Add'
              onClick={() => {
                addTrigger();
              }}
            />
          </Box>
        </Box>
        {triggerElements}
      </Stack>
    </Box>
  );
}
