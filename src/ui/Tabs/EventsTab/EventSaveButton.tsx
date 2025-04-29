import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Box, Button } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../app/hooks/useEvents';
import { useEventTableModal } from './context/EventTableModalContext';

export default function EventSaveButton() {
  const { close } = useEventTableModal();
  const { getValues } = useFormContext();
  const { getSaveEvents } = useEvents();
  const { saveEvents } = getSaveEvents();

  const saveEventsClick = () => {
    saveEvents(getValues());
    close();
  };

  return (
    <Box>
      <Button icon={faCheck} iconSize='large' onClick={saveEventsClick} />
    </Box>
  );
}
