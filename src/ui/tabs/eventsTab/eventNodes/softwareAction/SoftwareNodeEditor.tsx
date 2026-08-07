import React from 'react';
import { buildKey, buildNodeValueKey } from '../../FormKeys';
import {
  FormTextInput,
  FormSelectDropdown,
  FormNumberInput,
  Stack,
} from '@spooder/webui-component-library';
import FormUdpSelectDropdown from '../../../../common/input/form/FormUdpSelectDropdown';
import SoftwareConflictCheck from './SoftwareConflictCheck';

interface SoftwareNodeEditorProps {
  eventName: string;
  nodeIndex: number;
}

export default function SoftwareNodeEditor(props: SoftwareNodeEditorProps) {
  const { eventName, nodeIndex } = props;

  const nodeValueKey = buildNodeValueKey(eventName, nodeIndex);

  const addressFormKey = buildKey(nodeValueKey, 'address');
  const destUdpFormKey = buildKey(nodeValueKey, 'dest_udp');
  const valueOffFormKey = buildKey(nodeValueKey, 'valueOff');
  const valueOnFormKey = buildKey(nodeValueKey, 'valueOn');
  const eventTypeFormKey = buildKey(nodeValueKey, 'etype');
  const priorityFormKey = buildKey(nodeValueKey, 'priority');
  const durationFormKey = buildKey(nodeValueKey, 'duration');

  return (
    <Stack spacing='small'>
      <SoftwareConflictCheck eventName={eventName} nodeIndex={nodeIndex} />
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
      <FormNumberInput label='Priority:' formKey={priorityFormKey} />
    </Stack>
  );
}
