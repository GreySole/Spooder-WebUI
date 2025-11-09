import {
  EventTriggerProps,
  FormSelectDropdown,
  FormTextInput,
} from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildTriggerKey, buildKey } from '../../../FormKeys';

interface JoystickWheelConditionProps {
  conditionKey: string;
}

export default function JoystickWheelCondition(props: JoystickWheelConditionProps) {
  const { conditionKey } = props;
  const { watch } = useFormContext();
  const modeKey = buildKey(conditionKey, 'mode');
  const mode = watch(modeKey, '');
  const operatorKey = buildKey(conditionKey, 'operator');
  const operator = watch(operatorKey, '');

  if (mode === 'item') {
    return (
      <>
        <FormTextInput formKey={buildKey(modeKey, 'item')} label='Prize Name:' />
      </>
    );
  }

  return (
    <>
      <FormSelectDropdown
        formKey={operatorKey}
        label='Operator:'
        options={[
          { value: '==', label: 'Equal' },
          { value: '>', label: 'Greater Than' },
          { value: '>=', label: 'Greater Than Equal To' },
          { value: '<', label: 'Less Than' },
          { value: '<=', label: 'Less Than Equal To' },
          { value: '><', label: 'In Between Range' },
          { value: '<>', label: 'Outside of Range' },
        ]}
      />
      <FormTextInput formKey={buildKey(modeKey, 'amount')} label='Prize Cost:' />
      {operator === '><' || operator === '<>' ? (
        <FormTextInput formKey={buildKey(modeKey, 'amount2')} label='Prize Cost 2:' />
      ) : null}
    </>
  );
}
