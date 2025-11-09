import { useTheme, FormSelectDropdown } from '@greysole/spooder-component-library';
import React from 'react';
import { buildTriggerKey, buildKey } from '../../FormKeys';
import { EventTriggerProps } from '../../../../Types';

export default function JoystickTriggerType(props: EventTriggerProps) {
  const { eventName } = props;
  const { isMobileDevice } = useTheme();

  const joystickTriggerKey = buildTriggerKey(eventName, 'joystick');
  const typeKey = buildKey(joystickTriggerKey, 'type');

  const eventsubOptions = [
    { value: '', label: 'Select Event Type' },
    { value: 'Started', label: 'Stream Started' },
    { value: 'StreamResuming', label: 'Stream Resuming' },
    { value: 'Tipped', label: 'Tipped' },
    { value: 'WheelSpinClaimed', label: 'Wheel Spin Claimed' },
    { value: 'Followed', label: 'Followed' },
    { value: 'DeviceConnected', label: 'Device Connected' },
    { value: 'StreamEnding', label: 'Stream Ending' },
    { value: 'Ended', label: 'Stream Ended' },
  ];

  return (
    <FormSelectDropdown
      width={isMobileDevice ? '100%' : undefined}
      label='Type:'
      formKey={typeKey}
      options={eventsubOptions}
    />
  );
}
