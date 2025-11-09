import { Box, FormBoolSwitch, Border, Stack } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildTriggerKey, buildKey } from '../../FormKeys';
import JoystickTriggerType from './JoystickTriggerType';
import { EventTriggerProps } from '../../../../Types';
import JoystickTriggerTypeDetails from './JoystickTriggerTypeDetails';

export default function JoystickTrigger(props: EventTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  const joystickTriggerKey = buildTriggerKey(eventName, 'joystick');

  const enabledKey = buildKey(joystickTriggerKey, 'enabled');
  const enabled = watch(enabledKey, false);

  const typeKey = buildKey(joystickTriggerKey, 'type');
  const type = watch(typeKey, '');

  if (!enabled) {
    return (
      <Box width='100%' flexFlow='column'>
        <FormBoolSwitch label='Joystick:' formKey={enabledKey} />
      </Box>
    );
  }

  return (
    <Border>
      <Box width='100%' flexFlow='column' padding='small'>
        <FormBoolSwitch label='Joystick:' formKey={enabledKey} />
        <Stack spacing='small' margin='small'>
          <JoystickTriggerType eventName={eventName} />
          <JoystickTriggerTypeDetails eventName={eventName} />
        </Stack>
      </Box>
    </Border>
  );
}
