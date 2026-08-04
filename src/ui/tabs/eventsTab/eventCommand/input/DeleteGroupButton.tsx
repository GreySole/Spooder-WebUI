import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EVENT_KEY, GROUP_KEY } from '../../FormKeys';
import { Box, Button, TypeFace, useDialog } from '@spooder/webui-component-library';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import useEvents from '../../../../../app/hooks/useEvents';

interface DeleteGroupButtonProps {
  groupName: string;
}

export default function DeleteGroupButton(props: DeleteGroupButtonProps) {
  const { setValue, getValues } = useFormContext();
  const { getSaveEvents, getEvents } = useEvents();
  const { saveEvents } = getSaveEvents();
  const { openDialog, closeDialog } = useDialog();
  const { groupName } = props;
  const deleteClick = () => {
    const events = getValues(EVENT_KEY);
    const groups = getValues(GROUP_KEY);
    let newEvents = { ...events };
    let newGroups = [...groups];
    for (let ev in newEvents) {
      if (newEvents[ev].group == groupName) {
        delete newEvents[ev];
      }
    }
    newGroups.splice(newGroups.indexOf(groupName), 1);
    setValue(EVENT_KEY, newEvents);
    setValue(GROUP_KEY, newGroups);
    saveEvents(
      { events: newEvents, groups: newGroups },
      'Group deleted successfully!',
      'An error occurred while deleting the group.',
    ).then(() => {
      closeDialog();
    });
  };
  function deleteGroup(groupName: string) {
    openDialog(
      `Delete ${groupName}?`,
      <TypeFace>All events assigned to {groupName} will be deleted. Is that okay?</TypeFace>,
      [
        <Button
          label='Cancel'
          onClick={() => {
            closeDialog();
          }}
        />,
        <Button label='Delete' onClick={deleteClick} />,
      ],
    );
  }
  return (
    <Box padding='medium'>
      <Button
        label='Delete Group'
        icon={faTrash}
        onClick={() => deleteGroup(groupName)}
        className='delete-button'
      />
    </Box>
  );
}
