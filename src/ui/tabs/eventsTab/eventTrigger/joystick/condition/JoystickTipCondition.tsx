import {
  EventTriggerProps,
  FormSelectDropdown,
  FormTextInput,
} from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildTriggerKey, buildKey } from '../../../FormKeys';

interface JoystickTipConditionProps {
  conditionKey: string;
}

export default function JoystickTipCondition(props: JoystickTipConditionProps) {
  const { conditionKey } = props;
  const { watch } = useFormContext();
  const modeKey = buildKey(conditionKey, 'mode');
  const mode = watch(modeKey, '');
  const operatorKey = buildKey(conditionKey, 'operator');
  const operator = watch(operatorKey, '');

  if (mode === 'item') {
    return (
      <>
        <FormTextInput formKey={buildKey(modeKey, 'item')} label='Tip Item Name:' />
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
      <FormTextInput formKey={buildKey(modeKey, 'amount')} label='Tip Amount:' />
      {operator === '><' || operator === '<>' ? (
        <FormTextInput formKey={buildKey(modeKey, 'amount2')} label='Tip Amount 2:' />
      ) : null}
    </>
  );
}
