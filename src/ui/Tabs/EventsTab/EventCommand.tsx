import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Box, TypeFace, Button } from '@greysole/spooder-component-library';
import React from 'react';
import EventModCommand from './eventCommand/mod/EventModCommand';
import EventOBSCommand from './eventCommand/obs/EventOBSCommand';
import EventPluginCommand from './eventCommand/plugin/EventPluginCommand';
import EventResponseCommand from './eventCommand/response/EventResponseCommand';
import EventSoftwareCommand from './eventCommand/software/EventSoftwareCommand';
import { useFormContext } from 'react-hook-form';
import { EVENT_KEY } from './FormKeys';
import EventDiscordCommand from './eventCommand/discord/EventDiscordCommand';

interface EventCommandProps {
  eventName: string;
  commandIndex: number;
  commandType: string;
}

export default function EventCommand(props: EventCommandProps) {
  const { eventName, commandIndex, commandType } = props;
  const { getValues, setValue } = useFormContext();

  const deleteCommand = (commandIndex: number) => {
    const newCommands = getValues(`${EVENT_KEY}.${eventName}.commands`);
    newCommands.splice(commandIndex, 1);
    setValue(`${EVENT_KEY}.${eventName}.commands`, newCommands);
  };
  let element = null;
  let commandTypeName = '';
  switch (commandType) {
    case 'response':
      commandTypeName = 'Response';
      element = <EventResponseCommand eventName={eventName} commandIndex={commandIndex} />;
      break;
    case 'plugin':
      commandTypeName = 'Plugin';
      element = <EventPluginCommand eventName={eventName} commandIndex={commandIndex} />;
      break;
    case 'software':
      commandTypeName = 'Software';
      element = <EventSoftwareCommand eventName={eventName} commandIndex={commandIndex} />;
      break;
    case 'obs':
      commandTypeName = 'OBS';
      element = <EventOBSCommand eventName={eventName} commandIndex={commandIndex} />;
      break;
    case 'mod':
      commandTypeName = 'Mod';
      element = <EventModCommand eventName={eventName} commandIndex={commandIndex} />;
      break;
    case 'discord':
      commandTypeName = 'Discord';
      element = <EventDiscordCommand eventName={eventName} commandIndex={commandIndex} />;
      break;
  }

  return (
    <Box flexFlow='column'>
      <Box flexFlow='row' justifyContent='space-between'>
        <TypeFace fontSize='large'>{commandTypeName}</TypeFace>
        <Button
          label='Delete Command'
          icon={faTrash}
          onClick={() => {
            deleteCommand(commandIndex);
          }}
        />
      </Box>
      {element}
    </Box>
  );
}
