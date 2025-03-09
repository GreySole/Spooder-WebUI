import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import EventOBSCommand from './eventCommand/obs/EventOBSCommand';
import EventSoftwareCommand from './eventCommand/software/EventSoftwareCommand';
import EventPluginCommand from './eventCommand/plugin/EventPluginCommand';
import EventResponseCommand from './eventCommand/response/EventResponseCommand';
import EventModCommand from './eventCommand/mod/EventModCommand';
import EventAddCommand from './eventCommand/EventAddCommand';
import { buildCommandKey, buildKey, EVENT_KEY } from './FormKeys';
import { useFormContext } from 'react-hook-form';
import {
  OBSIcon,
  DiscordIcon,
  Button,
  Box,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import EventCommandTimeline from './eventCommand/EventCommandTimeline';

interface EventCommandsProps {
  eventName: string;
}

export default function EventCommands(props: EventCommandsProps) {
  const { eventName } = props;
  const { watch } = useFormContext();
  const eventCommands = watch(`${EVENT_KEY}.${eventName}.commands`, []);
  let commandElements = [];

  for (let c = 0; c < eventCommands.length; c++) {
    let element = null;
    switch (eventCommands[c].type) {
      case 'response':
        element = <EventResponseCommand eventName={eventName} commandIndex={c} />;
        break;
      case 'plugin':
        element = <EventPluginCommand eventName={eventName} commandIndex={c} />;
        break;
      case 'software':
        element = <EventSoftwareCommand eventName={eventName} commandIndex={c} />;
        break;
      case 'obs':
        element = <EventOBSCommand eventName={eventName} commandIndex={c} />;
        break;
      case 'mod':
        element = <EventModCommand eventName={eventName} commandIndex={c} />;
        break;
    }

    commandElements.push(
      <Box flexFlow='column' key={c}>
        <Box flexFlow='row' justifyContent='space-between'>
          <TypeFace fontSize='large'>{eventCommands[c].type}</TypeFace>
          <Button label='Delete Command' icon={faTrash} onClick={() => {}} />
        </Box>
        {element}
      </Box>,
    );
  }

  return (
    <Stack spacing='medium'>
      <TypeFace>Commands:</TypeFace>
      <EventCommandTimeline eventName={eventName} />
      {commandElements}
      <EventAddCommand eventName={eventName} />
    </Stack>
  );
}
