import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DISABLED_GROUP_KEY, GRAPH_KEY, GROUP_KEY } from '../../FormKeys';
import { Box, Button, TypeFace, useDialog } from '@greysole/spooder-component-library';
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
    const graphs = getValues(GRAPH_KEY);
    const groups = getValues(GROUP_KEY);
    const disabledGroups = getValues(DISABLED_GROUP_KEY);
    let newGraphs = Object.assign(graphs);
    let newGroups = Object.assign(groups);
    for (let ev in newGraphs) {
      if (newGraphs[ev].group == groupName) {
        delete newGraphs[ev];
      }
    }
    newGroups.splice(newGroups.indexOf(groupName), 1);
    setValue(GRAPH_KEY, newGraphs);
    setValue(GROUP_KEY, newGroups);
    saveEvents(
      { graphs: newGraphs, groups: newGroups, disabledGroups },
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
