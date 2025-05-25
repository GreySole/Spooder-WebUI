import { MultiPageModal, Box, Button, Columns } from '@greysole/spooder-component-library';
import React from 'react';
import EventCommands from '../EventCommands';
import EventGeneral from '../EventGeneral';
import EventTriggers from '../EventTriggers';
import { useEventTableModal } from './EventTableModalContext';
import EventSaveButton from '../EventSaveButton';
import { useFormContext } from 'react-hook-form';

export default function EventTableModal() {
  const { eventName, isOpen, close } = useEventTableModal();

  const handleClose = () => {
    close();
  };

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
      onClose={handleClose}
    />
  );
}
