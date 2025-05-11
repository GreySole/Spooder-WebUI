import { MultiPageModal, Box, Button, Columns } from '@greysole/spooder-component-library';
import React from 'react';
import EventCommands from '../EventCommands';
import EventGeneral from '../EventGeneral';
import EventTriggers from '../EventTriggers';
import { useEventTableModal } from './EventTableModalContext';
import EventSaveButton from '../EventSaveButton';

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
      headerContent={<EventSaveButton />}
      isOpen={isOpen}
      onClose={close}
    />
  );
}
