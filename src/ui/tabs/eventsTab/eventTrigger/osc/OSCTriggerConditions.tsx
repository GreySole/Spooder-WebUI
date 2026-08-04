import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EventTriggerProps, OSCConditionType, OSCHandleType } from '../../../../Types';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import { Box, Button, Expandable, Stack } from '@spooder/webui-component-library';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import OSCTriggerConditionGroup from './OSCTriggerConditionGroup';

interface OSCTriggerConditionProps {
  formKey: string;
  eventName: string;
  label: string;
}

export default function OSCTriggerConditions(props: OSCTriggerConditionProps) {
  const { formKey, eventName, label } = props;
  const { watch, setValue } = useFormContext();

  const oscTriggerKey = buildTriggerKey(eventName, 'osc');

  const conditionKey = buildKey(oscTriggerKey, formKey);
  const conditionGroups = watch(conditionKey, []);

  const addConditionGroup = () => {
    setValue(
      conditionKey,
      [
        ...conditionGroups,
        { mode: 'OR', conditions: [{ arg: 0, type: OSCConditionType.equal, value: '0' }] },
      ],
      { shouldDirty: true },
    );
  };

  const deleteConditionGroup = (groupIndex: number) => {
    const newConditionGroups = [...conditionGroups];
    newConditionGroups.splice(groupIndex, 1);
    setValue(conditionKey, newConditionGroups, { shouldDirty: true });
  };

  return (
    <Expandable label={label} forceOpen>
      <Stack width='100%' spacing='medium'>
        {conditionGroups.map((condition: any, index: number) => (
          <OSCTriggerConditionGroup
            key={index}
            formKey={conditionKey}
            groupIndex={index}
            deleteConditionGroup={deleteConditionGroup}
          />
        ))}
        <Box width='100%' justifyContent='flex-end'>
          <Button
            icon={faPlus}
            label='Add Group'
            onClick={() => {
              addConditionGroup();
            }}
          />
        </Box>
      </Stack>
    </Expandable>
  );
}
