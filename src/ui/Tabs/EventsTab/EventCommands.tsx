import React from 'react';
import EventAddCommand from './eventCommand/EventAddCommand';
import { EVENT_KEY } from './FormKeys';
import { useFormContext } from 'react-hook-form';
import { Stack, TypeFace } from '@greysole/spooder-component-library';
import EventCommandTimeline from './eventCommand/EventCommandTimeline';
import EventCommand from './EventCommand';

interface EventCommandsProps {
  eventName: string;
}

export default function EventCommands(props: EventCommandsProps) {
  const { eventName } = props;
  const { watch } = useFormContext();
  const eventCommands = watch(`${EVENT_KEY}.${eventName}.commands`, []);

  return (
    <Stack spacing='medium'>
      <TypeFace>Commands:</TypeFace>
      <EventCommandTimeline eventName={eventName} />
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
