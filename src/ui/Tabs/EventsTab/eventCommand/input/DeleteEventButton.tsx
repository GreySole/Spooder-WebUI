import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EVENT_KEY } from '../../FormKeys';
import Button from '../../../../common/input/controlled/Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface DeleteEventButtonProps {
  eventName: string;
}

export default function DeleteEventButton(props: DeleteEventButtonProps) {
  const { eventName } = props;
  const { getValues, setValue } = useFormContext();

  function deleteEvent(eventName: string) {
    let newState = getValues(EVENT_KEY);
    delete newState[eventName];

    setValue(EVENT_KEY, newState);
  }

  return <Button icon={faTrash} onClick={() => deleteEvent(eventName)} />;

  return (
    <div className='delete-event-div'>
      <button type='button' className='delete-button' onClick={() => deleteEvent(eventName)}>
        DELETE EVENT
      </button>
    </div>
  );
}
