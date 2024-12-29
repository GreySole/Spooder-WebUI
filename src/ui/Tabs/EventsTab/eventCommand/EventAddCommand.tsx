import React, { useState } from 'react';
import SelectDropdown from '../../../common/input/controlled/SelectDropdown';
import { useFormContext } from 'react-hook-form';

interface EventAddCommandProps {
  eventName: string;
}

export default function EventAddCommand(props: EventAddCommandProps) {
  const { eventName } = props;
  const { setValue, getValues } = useFormContext();
  const [selectedType, setSelectedType] = useState<string>('');

  const addEventCommand = (commandType: string) => {
    const eventCommands = getValues(`events.${eventName}.commands`);
  };

  return (
    <label className='add-command field-section'>
      <div className='add-command-fields'>
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
      </div>
      <div className='add-command-actions'>
        <button
          type='button'
          id='addCommandButton'
          value={selectedType}
          className='add-button'
          onClick={() => addEventCommand(selectedType)}
        >
          Add
        </button>
      </div>
    </label>
  );
}
