import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, useToast, ToastType, useTooltip } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../app/hooks/useEvents';
import { useEventTableModal } from './context/EventTableModalContext';

export default function EventSaveButton() {
  const { close } = useEventTableModal();
  const { getValues } = useFormContext();
  const { getSaveEvents } = useEvents();
  const { saveEvents } = getSaveEvents();
  const { getEvents } = useEvents();
  const { refetch } = getEvents();

  const saveEventsClick = () => {
    saveEvents(getValues()).then((response) => {
      refetch();
      close();
    });
  };

  return (
    <Box>
      <Button
        label='Save'
        icon={faCheck}
        iconSize='large'
        onClick={saveEventsClick}
        className='save-button'
      />
    </Box>
  );
}
