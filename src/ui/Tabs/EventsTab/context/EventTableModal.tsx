import { MultiPageModal, Box, Button, Columns } from '@greysole/spooder-component-library';
import React from 'react';
import EventCommands from '../EventCommands';
import EventGeneral from '../EventGeneral';
import EventTriggers from '../EventTriggers';
import { useEventTableModal } from './EventTableModalContext';
import EventSaveButton from '../EventSaveButton';
import { faTimeline } from '@fortawesome/free-solid-svg-icons';

export default function EventTableModal() {
  const { eventName, isOpen, close, showTimelineButton, onTimelineButtonClick } =
    useEventTableModal();

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
        <Columns spacing='small' padding='small'>
          {showTimelineButton ? (
            <Button
              width='4rem'
              icon={faTimeline}
              iconSize='large'
              onClick={onTimelineButtonClick}
            />
          ) : null}
          <EventSaveButton />
        </Columns>
      }
      isOpen={isOpen}
      onClose={close}
    />
  );
}
