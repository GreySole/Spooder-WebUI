import { Button, Columns, SelectDropdown } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
  DiscordCommand,
  ModCommand,
  OBSCommand,
  PluginCommand,
  ResponseCommand,
  SoftwareCommand,
} from '../../../Types';

interface EventAddCommandProps {
  eventName: string;
}

export default function EventAddCommand(props: EventAddCommandProps) {
  const { eventName } = props;
  const { setValue, getValues } = useFormContext();
  const [selectedType, setSelectedType] = useState<string>('response');

  const addEventCommand = (commandType: string) => {
    let newCommand = {};
    switch (commandType) {
      case 'response':
        newCommand = {
          type: 'response',
          etype: 'oneshot',
          message: '',
          delay: 0,
          interval: 30,
        } as ResponseCommand;
        break;
      case 'plugin':
        newCommand = {
          type: 'plugin',
          etype: 'oneshot',
          pluginname: '',
          eventname: '',
          stop_eventname: '',
          duration: 10,
          delay: 0,
        } as PluginCommand;
        break;
      case 'software':
        newCommand = {
          type: 'software',
          etype: 'oneshot',
          dest_udp: '-2',
          address: '',
          valueOn: '1',
          valueOff: '0',
          duration: 10,
          delay: 0,
          priority: 0,
        } as SoftwareCommand;
        break;
      case 'obs':
        newCommand = {
          type: 'obs',
          function: 'setinputmute',
          etype: 'oneshot',
          scene: '',
          item: '',
          valueOn: '1',
          valueOff: '0',
          itemOn: '',
          itemOff: '',
          duration: 10,
          delay: 0,
        } as OBSCommand;
        break;
      case 'mod':
        newCommand = {
          type: 'mod',
          function: 'lock',
          etype: 'timed',
          targettype: 'all',
          target: '',
          duration: 10,
          delay: 0,
        } as ModCommand;
        break;
      case 'discord':
        newCommand = {
          type: 'discord',
          function: 'message',
          guild: '',
          channel: '',
          message: '',
        } as DiscordCommand;
    }
    const eventCommands = getValues(`events.${eventName}.commands`);
    setValue(`events.${eventName}.commands`, [...eventCommands, newCommand]);
  };

  return (
    <Columns spacing='medium'>
      <SelectDropdown
        label='Command Type:'
        options={[
          { value: 'response', label: 'Response' },
          { value: 'plugin', label: 'Plugin' },
          { value: 'software', label: 'Software' },
          { value: 'obs', label: 'OBS' },
          { value: 'mod', label: 'Moderation' },
          { value: 'discord', label: 'Discord' },
        ]}
        onChange={(value) => setSelectedType(value)}
        value={selectedType}
      />
      <Button label='Add' onClick={() => addEventCommand(selectedType)} />
    </Columns>
  );
}
