import { MultiPageModal } from '@greysole/spooder-component-library';
import React, { useMemo } from 'react';
import EventCommands from '../EventCommands';
import EventGeneral from '../EventGeneral';
import EventSaveButton from '../EventSaveButton';
import { useEventTableModal } from './EventTableModalContext';
import EventNodes from '../EventNodes';

function EventTableModal() {
  const { eventName, isOpen, cancel } = useEventTableModal();

  const pages = useMemo(
    () => [
      {
        title: 'General',
        content: <EventGeneral eventName={eventName} />,
      },
      { title: 'Triggers', content: <EventNodes eventName={eventName} /> },
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
