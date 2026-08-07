import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey, buildNodeValueKey } from '../../FormKeys';
import { FormNumberInput, FormSelectDropdown, Stack } from '@spooder/webui-component-library';
import ModNodeTargetType from './ModNodeTargetType';
import ModNodeTarget from './ModNodeTarget';

interface ModNodeEditorProps {
  eventName: string;
  nodeIndex: number;
}

export default function ModNodeEditor(props: ModNodeEditorProps) {
  const { eventName, nodeIndex } = props;
  const nodeValueKey = buildNodeValueKey(eventName, nodeIndex);

  const { watch } = useFormContext();

  const modFunctionFormKey = buildKey(nodeValueKey, 'function');
  const targetFormKey = buildKey(nodeValueKey, 'target');
  const targetTypeFormKey = buildKey(nodeValueKey, 'targettype');
  const targetType = watch(targetTypeFormKey);
  const eventTypeFormKey = buildKey(nodeValueKey, 'etype');
  const eType = watch(eventTypeFormKey);
  const durationFormKey = buildKey(nodeValueKey, 'duration');

  const handleTypeOptions = [
    { value: 'toggle', label: 'Toggle' },
    { value: 'timed', label: 'Timed' },
  ];

  const modFunctionOptions = [
    { value: 'lock', label: 'Lock/Unlock' },
    { value: 'spamguard', label: 'Spam Guard' },
    { value: 'stop', label: 'Stop Event' },
  ];

  return (
    <Stack spacing='small' margin='small'>
      <FormSelectDropdown
        formKey={modFunctionFormKey}
        label='Function'
        options={modFunctionOptions}
      />
      <ModNodeTargetType formKey={targetTypeFormKey} />
      {targetType !== 'all' ? <ModNodeTarget formKey={targetFormKey} targetType={targetType} /> : null}
      <FormSelectDropdown
        formKey={eventTypeFormKey}
        label='Handle Type'
        options={handleTypeOptions}
      />
      {eType === 'timed' ? (
        <FormNumberInput formKey={durationFormKey} label='Duration (Seconds)' />
      ) : null}
    </Stack>
  );
}
