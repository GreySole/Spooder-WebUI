import {
  FormNumberInput,
  FormSelectDropdown,
  FormTextInput,
} from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey } from '../../../FormKeys';

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
        <FormTextInput formKey={buildKey(conditionKey, 'item')} label='Prize Name:' />
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
      <FormNumberInput formKey={buildKey(conditionKey, 'amount')} label='Prize Cost:' />
      {operator === '><' || operator === '<>' ? (
        <FormNumberInput formKey={buildKey(conditionKey, 'amount2')} label='Prize Cost 2:' />
      ) : null}
    </>
  );
}
