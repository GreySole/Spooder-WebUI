import { MultiPageModal, Box, Button, Columns } from '@spooder/webui-component-library';
import React, { useMemo } from 'react';
import EventCommands from '../EventCommands';
import EventGeneral from '../EventGeneral';
import EventTriggers from '../EventTriggers';
import { useEventTableModal } from './EventTableModalContext';
import EventSaveButton from '../EventSaveButton';

function EventTableModal() {
  const { eventName, isOpen, cancel } = useEventTableModal();

  const pages = useMemo(
    () => [
      {
        title: 'General',
        content: <EventGeneral eventName={eventName} />,
      },
      { title: 'Triggers', content: <EventTriggers eventName={eventName} /> },
      {
        title: 'Commands',
        content: <EventCommands eventName={eventName} />,
      },
    ],
    [eventName],
  );

  return (
    <MultiPageModal
      title={eventName}
      pages={pages}
      headerContent={<EventSaveButton />}
      isOpen={isOpen}
      onClose={cancel}
    />
  );
}

export default React.memo(EventTableModal);
