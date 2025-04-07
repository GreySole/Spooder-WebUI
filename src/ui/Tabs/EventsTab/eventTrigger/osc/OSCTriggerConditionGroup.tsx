import { faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  Border,
  Stack,
  Box,
  FormSelectDropdown,
  Button,
  TypeFace,
} from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { OSCConditionType } from '../../../../Types';
import { buildKey } from '../../FormKeys';
import OSCTriggerCondition from './OSCTriggerConditionsValue';

interface TriggerConditionGroup {
  formKey: string;
  groupIndex: number;
  deleteConditionGroup: (groupIndex: number) => void;
}

export default function OSCTriggerConditionGroup(props: TriggerConditionGroup) {
  const { formKey, groupIndex, deleteConditionGroup } = props;
  const { watch, setValue } = useFormContext();
  const groupFormKey = buildKey(formKey, `${groupIndex}`);
  const groupModeKey = buildKey(groupFormKey, 'mode');
  const groupConditionKey = buildKey(groupFormKey, 'conditions');
  const groupConditionValues = watch(groupConditionKey, []);

  const addCondition = () => {
    setValue(groupConditionKey, [
      ...groupConditionValues,
      { type: OSCConditionType.equal, value: '0' },
    ]);
  };

  const deleteCondition = (conditionIndex: number) => {
    const newConditions = [...groupConditionValues];
    newConditions.splice(conditionIndex, 1);
    setValue(groupConditionKey, newConditions);
  };

  return (
    <Border borderBottom>
      <Stack width='100%' spacing='small' padding='small'>
        <Border borderBottom>
          <Box flexFlow='row' justifyContent='space-between' marginBottom='small'>
            <FormSelectDropdown
              formKey={groupModeKey}
              label='Mode'
              options={[
                { value: 'AND', label: 'AND' },
                { value: 'OR', label: 'OR' },
              ]}
            />
            <Box height='50px'>
              <Button
                label='Delete Group'
                iconSize='25px'
                icon={faTrash}
                onClick={() => {
                  deleteConditionGroup(groupIndex);
                }}
              />
            </Box>
          </Box>
        </Border>
        <Stack spacing='medium' marginTop='small'>
          <Box justifyContent='space-between'>
            <TypeFace>Index</TypeFace>
            <TypeFace>Condition</TypeFace>
            <TypeFace>Action</TypeFace>
          </Box>
          {groupConditionValues.map((condition: any, index: number) => (
            <OSCTriggerCondition
              formKey={groupConditionKey}
              conditionIndex={index}
              deleteCondition={deleteCondition}
            />
          ))}
          <Box width='100%' justifyContent='flex-end' padding='small'>
            <Button
              icon={faPlus}
              label='Add Condition'
              onClick={() => {
                addCondition();
              }}
            />
          </Box>
        </Stack>
      </Stack>
    </Border>
  );
}
