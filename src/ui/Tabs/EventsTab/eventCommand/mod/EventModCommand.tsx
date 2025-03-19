import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildCommandKey, buildKey } from '../../FormKeys';
import usePlugins from '../../../../../app/hooks/usePlugins';
import { EventCommandProps } from '../../../../Types';
import { FormNumberInput, FormSelectDropdown, Stack } from '@greysole/spooder-component-library';
import ModTargetType from './ModTargetType';
import ModTarget from './ModTarget';

export default function EventModCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const formKey = buildCommandKey(eventName, commandIndex);

  const { watch } = useFormContext();

  const modFunctionFormKey = buildKey(formKey, 'function');
  const targetFormKey = buildKey(formKey, 'target');
  const targetTypeFormKey = buildKey(formKey, 'targettype');
  const targetType = watch(targetTypeFormKey);
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey);
  const durationFormKey = buildKey(formKey, 'duration');
  const delayFormKey = buildKey(formKey, 'delay');

  const handleTypeOptions = [
    { value: 'toggle', label: 'Toggle' },
    { value: 'timed', label: 'Timed' },
  ];

  const modFunctionOptions = [
    { value: 'lock', label: 'Lock/Unlock' },

    { value: 'spamguard', label: 'Spam Guard' },
    { value: 'stop', label: 'Stop Event' },
  ];

  console.log('targetType', targetType);

  return (
    <Stack spacing='small' margin='small'>
      <FormSelectDropdown
        formKey={modFunctionFormKey}
        label='Function'
        options={modFunctionOptions}
      />
      <ModTargetType formKey={targetTypeFormKey} />
      {targetType !== 'all' ? <ModTarget formKey={targetFormKey} targetType={targetType} /> : null}
      <FormSelectDropdown
        formKey={eventTypeFormKey}
        label='Handle Type'
        options={handleTypeOptions}
      />
      {eType === 'timed' ? (
        <FormNumberInput formKey={durationFormKey} label='Duration (Seconds)' />
      ) : null}
      <FormNumberInput formKey={delayFormKey} label='Delay (Milliseconds)' />
    </Stack>
  );
}
