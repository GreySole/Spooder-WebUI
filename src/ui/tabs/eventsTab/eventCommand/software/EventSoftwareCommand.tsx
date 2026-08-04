import React from 'react';
import { buildCommandKey, buildKey } from '../../FormKeys';
import { EventCommandProps } from '../../../../Types';
import {
  FormTextInput,
  FormSelectDropdown,
  FormNumberInput,
  Stack,
} from '@spooder/webui-component-library';
import FormUdpSelectDropdown from '../../../../common/input/form/FormUdpSelectDropdown';
import EventSoftwareConflictCheck from './EventSoftwareContflictCheck';

export default function EventSoftwareCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;

  const formKey = buildCommandKey(eventName, commandIndex);

  const addressFormKey = buildKey(formKey, 'address');
  const destUdpFormKey = buildKey(formKey, 'dest_udp');
  const valueOffFormKey = buildKey(formKey, 'valueOff');
  const valueOnFormKey = buildKey(formKey, 'valueOn');
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const delayFormKey = buildKey(formKey, 'delay');
  const priorityFormKey = buildKey(formKey, 'priority');
  const durationFormKey = buildKey(formKey, 'duration');

  return (
    <Stack spacing='small'>
      <EventSoftwareConflictCheck eventName={eventName} commandIndex={commandIndex} />
      <FormTextInput label='Address:' formKey={addressFormKey} />
      <FormUdpSelectDropdown label='Destination:' formKey={destUdpFormKey} />
      <FormTextInput label='Value On:' formKey={valueOnFormKey} />
      <FormTextInput label='Value Off:' formKey={valueOffFormKey} />
      <FormSelectDropdown
        label='Event Type:'
        formKey={eventTypeFormKey}
        options={[
          { label: 'Timed', value: 'timed' },
          { label: 'Button Press', value: 'button-press' },
          { label: 'One Shot', value: 'oneshot' },
        ]}
      />
      <FormNumberInput label='Duration (Seconds):' formKey={durationFormKey} />
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
      <FormNumberInput label='Priority:' formKey={priorityFormKey} />
    </Stack>
  );
}
