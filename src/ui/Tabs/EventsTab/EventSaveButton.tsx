import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { Box, Button } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export default function EventSaveButton() {
  const { getValues } = useFormContext();

  const saveEvents = () => {
    // Save the events and groups to the database or perform any other action
    console.log('Saving events:', getValues());
  };

  return (
    <Box>
      <Button icon={faCheck} iconSize='large' onClick={saveEvents} />
    </Box>
  );
}
