import { faSave } from '@fortawesome/free-solid-svg-icons';
import { Box, Button } from '@spooder/webui-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useEvents from '../../../app/hooks/useEvents';

export default function EventSaveButton() {
  const { getValues, formState } = useFormContext();
  const { getSaveEvents } = useEvents();
  const { saveEvents } = getSaveEvents();
  const { getEvents } = useEvents();
  const { refetch } = getEvents();

  const saveEventsClick = () => {
    // Form root already mirrors the /save_event_graphs body: { graphs, groups, disabledGroups }.
    saveEvents(
      getValues(),
      'Events saved successfully!',
      'An error occurred while saving the events.',
    ).then((response) => {
      refetch();
    });
  };

  if (!formState.isDirty) {
    return null;
  }

  return (
    <Box>
      <Button
        label='Save'
        icon={faSave}
        iconSize='large'
        onClick={saveEventsClick}
        className='save-button'
      />
    </Box>
  );
}
