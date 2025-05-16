import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey } from '../../FormKeys';
import { SelectOption } from '../../../../Types';
import {
  FormSelectDropdown,
  FormBoolSwitch,
  FormNumberInput,
} from '@greysole/spooder-component-library';

interface ObsSetInputMuteInputProps {
  formKey: string;
  inputItemOptions: SelectOption[];
}

export default function ObsSetInputMuteInput(props: ObsSetInputMuteInputProps) {
  const { formKey, inputItemOptions } = props;
  const { watch } = useFormContext();

  const valueOffFormKey = buildKey(formKey, 'valueOff');
  const valueOnFormKey = buildKey(formKey, 'valueOn');
  const itemFormKey = buildKey(formKey, 'item');
  const durationFormKey = buildKey(formKey, 'duration');
  const delayFormKey = buildKey(formKey, 'delay');
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  return (
    <div className='command-content'>
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
    </div>
  );
}
