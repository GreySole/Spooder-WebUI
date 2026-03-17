import { Border, Box, FormBoolSwitch, Stack } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { EventTriggerProps } from '../../../../Types';
import { buildKey, buildTriggerKey } from '../../FormKeys';
import JoystickTriggerType from './JoystickTriggerType';
import JoystickTriggerTypeDetails from './JoystickTriggerTypeDetails';

export default function JoystickTrigger(props: EventTriggerProps) {
  const { eventName } = props;
  const { watch } = useFormContext();

  const joystickTriggerKey = buildTriggerKey(eventName, 'joystick');

  const enabledKey = buildKey(joystickTriggerKey, 'enabled');
  const enabled = watch(enabledKey, false);

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
