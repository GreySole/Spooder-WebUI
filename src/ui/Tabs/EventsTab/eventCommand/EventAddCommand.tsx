import { Button, Columns, SelectDropdown } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import {
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
          search: false,
          delay: 0,
          message: '',
        } as ResponseCommand;
        break;
      case 'plugin':
        newCommand = {
          type: 'plugin',
          etype: 'timed',
          pluginname: '',
          eventname: '',
          stop_eventname: '',
          duration: 0,
          delay: 0,
        } as PluginCommand;
        break;
      case 'software':
        newCommand = {
          type: 'software',
          etype: 'timed',
          dest_udp: '-2',
          address: '',
          valueOn: '',
          valueOff: '',
          duration: 0,
          delay: 0,
          priority: 0,
        } as SoftwareCommand;
        break;
      case 'obs':
        newCommand = {
          type: 'obs',
          function: 'setinputmute',
          etype: 'timed',
          scene: '',
          item: '',
          valueOn: '',
          valueOff: '',
          itemOn: '',
          itemOff: '',
          duration: 0,
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
          duration: 0,
          delay: 0,
        } as ModCommand;
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
        ]}
        onChange={(value) => setSelectedType(value)}
        value={selectedType}
      />
      <Button label='Add' onClick={() => addEventCommand(selectedType)} />
    </Columns>
  );
}
