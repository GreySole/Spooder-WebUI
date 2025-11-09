import React from 'react';
import {
  EventTriggerProps,
  FormSelectDropdown,
  FormTextInput,
  Stack,
} from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import { buildTriggerKey, buildKey } from '../../FormKeys';
import JoystickTipCondition from './condition/JoystickTipCondition';
import JoystickWheelCondition from './condition/JoystickWheelCondition';

export default function JoystickTriggerTypeDetails(props: EventTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();
  const joystickTriggerKey = buildTriggerKey(eventName, 'joystick');
  const conditionKey = buildKey(joystickTriggerKey, 'condition');
  const typeKey = buildKey(joystickTriggerKey, 'type');
  const type = watch(typeKey, '');

  return (
    <Stack spacing='small'>
      <JoystickTriggerTypeDetailsConditions conditionKey={conditionKey} type={type} />
    </Stack>
  );
}

function JoystickTriggerTypeDetailsConditions(props: { conditionKey: string; type: string }) {
  const { type, conditionKey } = props;

  if (type === 'Tipped') {
    return (
      <>
        <FormSelectDropdown
          formKey={buildKey(conditionKey, 'mode')}
          label='Condition:'
          options={[
            { value: '', label: 'Select Condition' },
            { value: 'item', label: 'Tip Item' },
            { value: 'amount', label: 'Tip Amount' },
          ]}
        />
        <JoystickTipCondition conditionKey={conditionKey} />
      </>
    );
  } else if (type === 'WheelSpinClaimed') {
    return (
      <>
        <FormSelectDropdown
          formKey={buildKey(conditionKey, 'mode')}
          label='Condition:'
          options={[
            { value: '', label: 'Select Condition' },
            { value: 'item', label: 'Prize Item' },
            { value: 'amount', label: 'Prize Cost' },
          ]}
        />
        <JoystickWheelCondition conditionKey={conditionKey} />
      </>
    );
  }
}
