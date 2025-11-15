import React from 'react';
import { faFileImport } from '@fortawesome/free-solid-svg-icons';
import { Box, Button, useTheme } from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import { useEventTableModal } from '../../context/EventTableModalContext';
import useEvents from '../../../../../app/hooks/useEvents';

export default function ImportGroupButton() {
  const { setValue, getValues, reset } = useFormContext();
  const { resetFormRef } = useEventTableModal();
  const { isMobileDevice } = useTheme();
  const { getSaveEvents } = useEvents();
  const { saveEvents } = getSaveEvents();
  const { getEvents } = useEvents();
  const { refetch } = getEvents();

  return (
    <Box paddingLeft='medium'>
      <Button
        icon={faFileImport}
        label={isMobileDevice ? 'Import' : 'Import Group'}
        iconGap='0.5rem'
        iconSize='large'
        onClick={() => {
          const input = document.createElement('input');
          input.type = 'file';
          input.accept = '.json,application/json';
          input.onchange = (e: any) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (event: any) => {
              const jsonContent = JSON.parse(event.target.result);
              const groups = getValues('groups');
              const events = getValues('events');
              const newGroupName = jsonContent._meta.groupName;
              if (!groups.includes(newGroupName)) {
                groups.push(newGroupName);
                setValue('groups', groups);
              }
              for (let ev in jsonContent.events) {
                const newEventName = `_${newGroupName.replace(/[^a-zA-Z0-9]/g, '_')}_${jsonContent.events[ev].name}`;
                jsonContent.events[ev].group = newGroupName;
                events[newEventName] = jsonContent.events[ev];
              }
              reset({
                groups,
                events,
              });
              resetFormRef.current?.();

              saveEvents(
                getValues(),
                'Group imported successfully!',
                'An error occurred while importing the group.',
              ).then((response) => {
                refetch();
              });
              console.log('Imported group:', jsonContent._meta.groupName, events);
            };
            reader.readAsText(file);
          };
          input.click();
        }}
      />
    </Box>
  );
}
