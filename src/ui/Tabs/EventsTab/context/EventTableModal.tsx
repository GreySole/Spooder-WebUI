import { MultiPageModal, Box, Button } from '@greysole/spooder-component-library';
import React from 'react';
import EventCommands from '../EventCommands';
import EventGeneral from '../EventGeneral';
import EventTriggers from '../EventTriggers';
import { useEventTableModal } from './EventTableModalContext';

export default function EventTableModal() {
  const { eventName, isOpen, close } = useEventTableModal();

  return (
    <MultiPageModal
      title={eventName}
      pages={[
        {
          title: 'General',
          content: <EventGeneral eventName={eventName} />,
        },
        { title: 'Triggers', content: <EventTriggers eventName={eventName} /> },
        {
          title: 'Commands',
          content: <EventCommands eventName={eventName} />,
        },
      ]}
      footerContent={
        <Box flexFlow='row' justifyContent='flex-end' padding='small'>
          <Button label='Save' onClick={() => {}} />
        </Box>
      }
      isOpen={isOpen}
      onClose={close}
    />
  );
}
