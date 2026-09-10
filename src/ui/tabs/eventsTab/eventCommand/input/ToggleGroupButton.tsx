import React from 'react';
import { useFormContext } from 'react-hook-form';
import { DISABLED_GROUP_KEY, GRAPH_KEY, GROUP_KEY } from '../../FormKeys';
import { Box, Button } from '@spooder/webui-component-library';
import { faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import useEvents from '../../../../../app/hooks/useEvents';

interface ToggleGroupButtonProps {
  groupName: string;
}

export default function ToggleGroupButton(props: ToggleGroupButtonProps) {
  const { groupName } = props;
  const { getValues, setValue, watch } = useFormContext();
  const { getSaveEvents } = useEvents();
  const { saveEvents } = getSaveEvents();

  const disabledGroups: string[] = watch(DISABLED_GROUP_KEY) ?? [];
  const isDisabled = disabledGroups.includes(groupName);

  const toggleGroup = () => {
    const graphs = getValues(GRAPH_KEY);
    const groups = getValues(GROUP_KEY);
    const currentDisabledGroups: string[] = getValues(DISABLED_GROUP_KEY) ?? [];
    const newDisabledGroups = isDisabled
      ? currentDisabledGroups.filter((name) => name !== groupName)
      : [...currentDisabledGroups, groupName];

    setValue(DISABLED_GROUP_KEY, newDisabledGroups);
    saveEvents(
      { graphs, groups, disabledGroups: newDisabledGroups },
      isDisabled ? 'Group enabled successfully!' : 'Group disabled successfully!',
      'An error occurred while updating the group.',
    );
  };

  return (
    <Box padding='medium'>
      <Button
        label={isDisabled ? 'Enable Group' : 'Disable Group'}
        icon={isDisabled ? faToggleOff : faToggleOn}
        onClick={toggleGroup}
      />
    </Box>
  );
}
