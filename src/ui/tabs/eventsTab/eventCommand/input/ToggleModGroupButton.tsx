import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DISABLED_GROUP_KEY, GRAPH_KEY, GROUP_KEY, MOD_GROUP_KEY } from '../../FormKeys';
import { Box, Button } from '@spooder/webui-component-library';
import { faUserShield } from '@fortawesome/free-solid-svg-icons';
import useEvents from '../../../../../app/hooks/useEvents';

interface ToggleModGroupButtonProps {
  groupName: string;
}

// Lets moderators view and edit this group's events from the mod UI. Events in any other group
// stay out of their reach, whatever they send the server.
export default function ToggleModGroupButton(props: ToggleModGroupButtonProps) {
  const { groupName } = props;
  const { getValues, setValue, watch } = useFormContext();
  const { getSaveEvents } = useEvents();
  const { saveEvents } = getSaveEvents();

  const modGroups: string[] = watch(MOD_GROUP_KEY) ?? [];
  const isModEditable = modGroups.includes(groupName);

  const toggle = () => {
    const current: string[] = getValues(MOD_GROUP_KEY) ?? [];
    const next = isModEditable
      ? current.filter((name) => name !== groupName)
      : [...current, groupName];

    setValue(MOD_GROUP_KEY, next);
    saveEvents(
      {
        graphs: getValues(GRAPH_KEY),
        groups: getValues(GROUP_KEY),
        disabledGroups: getValues(DISABLED_GROUP_KEY) ?? [],
        modGroups: next,
      },
      isModEditable ? 'Mods can no longer edit this group.' : 'Mods can now edit this group.',
      'An error occurred while updating the group.',
    );
  };

  return (
    <Box padding='medium'>
      <Button
        label={isModEditable ? 'Mods Can Edit: On' : 'Mods Can Edit: Off'}
        icon={faUserShield}
        onClick={toggle}
        tooltipText='Let moderators view and edit this group in the mod UI'
      />
    </Box>
  );
}
