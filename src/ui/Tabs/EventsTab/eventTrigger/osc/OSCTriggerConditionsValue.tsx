import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Box,
  TypeFace,
  Stack,
  FormSelectDropdown,
  FormTextInput,
  Button,
} from '@greysole/spooder-component-library';
import { OSCConditionType } from '../../../../Types';
import { buildKey } from '../../FormKeys';

interface TriggerCondition {
  formKey: string;
  conditionIndex: number;
  deleteCondition: (conditionIndex: number) => void;
}

export default function OSCTriggerCondition(props: TriggerCondition) {
  const { formKey, conditionIndex, deleteCondition } = props;

  const conditionKey = buildKey(formKey, `${conditionIndex}`);
  const typeKey = buildKey(conditionKey, 'type');
  const valueKey = buildKey(conditionKey, 'value');

  return (
    <Box flexFlow='row' justifyContent='space-between' alignItems='center'>
      <TypeFace>{conditionIndex}</TypeFace>
      <Stack spacing='small'>
        <FormSelectDropdown
          formKey={typeKey}
          options={[
            { value: OSCConditionType.equal, label: 'Equal to' },
            { value: OSCConditionType.notEqual, label: 'Not equal to' },
            { value: OSCConditionType.greaterThanOrEqual, label: 'Greater than or equal to' },
            { value: OSCConditionType.lessThanOrEqual, label: 'Less than or equal to' },
            { value: OSCConditionType.greaterThan, label: 'Greater than' },
            { value: OSCConditionType.lessThan, label: 'Less than' },
          ]}
        />
        <FormTextInput width='100%' formKey={valueKey} />
      </Stack>
      <Button
        iconSize='large'
        icon={faTrash}
        onClick={() => {
          deleteCondition(conditionIndex);
        }}
      />
    </Box>
  );
}
