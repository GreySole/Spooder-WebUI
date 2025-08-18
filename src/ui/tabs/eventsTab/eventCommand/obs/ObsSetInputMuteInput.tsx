import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey } from '../../FormKeys';
import { SelectOption } from '../../../../Types';
import {
  FormSelectDropdown,
  FormBoolSwitch,
  FormNumberInput,
  Stack,
} from '@greysole/spooder-component-library';
import useOBS from '../../../../../app/hooks/useOBS';

interface ObsSetInputMuteInputProps {
  formKey: string;
}

export default function ObsSetInputMuteInput(props: ObsSetInputMuteInputProps) {
  const { formKey } = props;
  const { watch } = useFormContext();
  const { getScenes } = useOBS();
  const { data: sceneData, isLoading: scenesLoading, error: scenesError } = getScenes();

  const valueOffFormKey = buildKey(formKey, 'valueOff');
  const valueOnFormKey = buildKey(formKey, 'valueOn');
  const itemFormKey = buildKey(formKey, 'item');
  const durationFormKey = buildKey(formKey, 'duration');
  const delayFormKey = buildKey(formKey, 'delay');
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  if (scenesLoading || scenesError) {
    return null;
  }

  const inputItemOptions = sceneData.inputs.map((input: any) => ({
    label: input.inputName,
    value: input.inputName,
  }));

  inputItemOptions.unshift({ value: '', label: 'Choose Input' });

  return (
    <Stack spacing='small'>
      <FormSelectDropdown label='Item:' formKey={itemFormKey} options={inputItemOptions} />
      <FormBoolSwitch label='Value On:' formKey={valueOnFormKey} />
      {eType == 'timed' ? <FormBoolSwitch label='Value Off:' formKey={valueOffFormKey} /> : null}
      <FormSelectDropdown
        label='Event Type:'
        formKey={eventTypeFormKey}
        options={[
          { label: 'Timed', value: 'timed' },
          { label: 'One Shot', value: 'oneshot' },
        ]}
      />
      {eType === 'timed' ? (
        <FormNumberInput label='Duration (Seconds):' formKey={durationFormKey} />
      ) : null}
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
    </Stack>
  );
}
