import React from 'react';
import { useFormContext } from 'react-hook-form';
import { OSCConditionType } from '../../../../Types';
import { buildKey } from '../../FormKeys';
import { Box, Button, Expandable, Stack } from '@greysole/spooder-component-library';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import OscConditionGroup from './OscConditionGroup';

interface OscConditionsProps {
  nodeValueKey: string;
  fieldName: string;
  label: string;
}

export default function OscConditions(props: OscConditionsProps) {
  const { nodeValueKey, fieldName, label } = props;
  const { watch, setValue } = useFormContext();

  const conditionKey = buildKey(nodeValueKey, fieldName);
  const conditionGroups = watch(conditionKey, []);

  const addConditionGroup = () => {
    setValue(conditionKey, [
      ...conditionGroups,
      { mode: 'OR', conditions: [{ arg: 0, type: OSCConditionType.equal, value: '0' }] },
    ]);
  };

  const deleteConditionGroup = (groupIndex: number) => {
    const newConditionGroups = [...conditionGroups];
    newConditionGroups.splice(groupIndex, 1);
    setValue(conditionKey, newConditionGroups);
  };

  return (
    <Expandable label={label} forceOpen>
      <Stack width='100%' spacing='medium'>
        {conditionGroups.map((condition: any, index: number) => (
          <OscConditionGroup
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
