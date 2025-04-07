import React, { useEffect, useState } from 'react';
import EventAddCommand from './eventCommand/EventAddCommand';
import { EVENT_KEY } from './FormKeys';
import { useFormContext } from 'react-hook-form';
import { Stack, TypeFace } from '@greysole/spooder-component-library';
import EventCommandTimeline from './eventCommand/EventCommandTimeline';
import EventCommand from './EventCommand';
import { useEventTableModal } from './context/EventTableModalContext';

interface EventCommandsProps {
  eventName: string;
}

export default function EventCommands(props: EventCommandsProps) {
  const { setShowTimelineButton, setOnTimelineButtonClick } = useEventTableModal();
  const { eventName } = props;
  const { watch } = useFormContext();
  const eventCommands = watch(`${EVENT_KEY}.${eventName}.commands`, []);
  const [showTimeline, setShowTimeline] = useState(false);

  useEffect(() => {
    setShowTimelineButton(true);
    setOnTimelineButtonClick(() => setShowTimeline((prev) => !prev));
    return () => {
      setShowTimelineButton(false);
      setOnTimelineButtonClick(() => {});
    };
  }, []);

  if (showTimeline) {
    return <EventCommandTimeline eventName={eventName} />;
  }

  return (
    <Stack spacing='medium'>
      <TypeFace>Commands:</TypeFace>
      {eventCommands.map((command: any, index: number) => (
        <EventCommand
          key={`${eventName}-${index}`}
          eventName={eventName}
          commandIndex={index}
          commandType={command.type}
        />
      ))}
      <EventAddCommand eventName={eventName} />
    </Stack>
  );
}
