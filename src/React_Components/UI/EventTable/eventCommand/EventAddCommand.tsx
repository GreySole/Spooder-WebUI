import { useState } from 'react';

interface EventAddCommandProps {
  onClickAdd: (commandType: string) => void;
}

export default function EventAddCommand(props: EventAddCommandProps) {
  const { onClickAdd } = props;
  const [selectedType, setSelectedType] = useState<string>('');
  return (
    <label className='add-command field-section'>
      <div className='add-command-fields'>
        <label>
          Command Type:
          <select id='addCommandType' name='type' onChange={(e) => setSelectedType(e.target.value)}>
            <option value={'response'}>Reponse</option>
            <option value={'plugin'}>Plugin</option>
            <option value={'software'}>Software</option>
            <option value={'obs'}>OBS</option>
            <option value={'mod'}>Moderation</option>
          </select>
        </label>
      </div>
      <div className='add-command-actions'>
        <button
          type='button'
          id='addCommandButton'
          value={selectedType}
          className='add-button'
          onClick={() => onClickAdd(selectedType)}
        >
          Add
        </button>
      </div>
    </label>
  );
}
