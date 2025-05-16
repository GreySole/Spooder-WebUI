import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EventTriggerProps, OSCConditionType, OSCHandleType } from '../../../../Types';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import {
  Border,
  Box,
  Button,
  Expandable,
  FormSelectDropdown,
  FormTextInput,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import OSCTriggerConditionGroup from './OSCTriggerConditionGroup';

export default function OSCTriggerConditions(props: EventTriggerProps) {
  const { eventName } = props;
  const { watch, setValue } = useFormContext();

  const oscTriggerKey = buildTriggerKey(eventName, 'osc');

  const handleTypeKey = buildKey(oscTriggerKey, 'handletype');
  const handleType = watch(handleTypeKey, OSCHandleType.trigger);

  const conditionKey = buildKey(oscTriggerKey, 'condition_groups_on');
  const conditionGroups = watch(conditionKey, []);

  const addConditionGroup = () => {
    setValue(conditionKey, [
      ...conditionGroups,
      { mode: 'OR', conditions: [{ type: OSCConditionType.equal, value: '0' }] },
    ]);
    console.log('CONDITIONS GROUPS', conditionGroups);
  };

  const deleteConditionGroup = (groupIndex: number) => {
    const newConditionGroups = [...conditionGroups];
    newConditionGroups.splice(groupIndex, 1);
    setValue(conditionKey, newConditionGroups);
  };

  console.log('CONDITION RENDER', conditionGroups);

  return (
    <Expandable label='Conditions' forceOpen>
      <Stack width='100%' spacing='medium'>
        {conditionGroups.map((condition: any, index: number) => (
          <OSCTriggerConditionGroup
            formKey={conditionKey}
            groupIndex={index}
            deleteConditionGroup={deleteConditionGroup}
          />
        ))}
        <Button
          icon={faPlus}
          label='Add Group'
          onClick={() => {
            addConditionGroup();
          }}
        />
      </Stack>
    </Expandable>
  );
}
