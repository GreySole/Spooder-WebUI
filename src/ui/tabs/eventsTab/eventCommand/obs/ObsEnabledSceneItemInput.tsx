import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey } from '../../FormKeys';
import { SelectOption } from '../../../../Types';
import {
  FormSelectDropdown,
  FormBoolSwitch,
  FormNumberInput,
} from '@greysole/spooder-component-library';

interface ObsEnableSceneItemInputProps {
  formKey: string;
  sceneOptions: [];
  sceneItemOptions: SelectOption[];
}

export default function ObsEnableSceneItemInput(props: ObsEnableSceneItemInputProps) {
  const { formKey, sceneOptions, sceneItemOptions } = props;

  const { watch } = useFormContext();
  const valueOffFormKey = buildKey(formKey, 'itemOff');
  const valueOnFormKey = buildKey(formKey, 'itemOn');
  const sceneFormKey = buildKey(formKey, 'item');
  const itemFormKey = buildKey(formKey, 'item');
  const durationFormKey = buildKey(formKey, 'duration');
  const delayFormKey = buildKey(formKey, 'delay');
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  return (
    <div className='command-content'>
      <FormSelectDropdown label='Scene:' formKey={sceneFormKey} options={sceneOptions} />
      <FormSelectDropdown label='Item:' formKey={itemFormKey} options={sceneItemOptions} />
      <FormBoolSwitch label='Value On:' formKey={valueOnFormKey} />
      {eType == 'timed' ? <FormBoolSwitch label='Value Off:' formKey={valueOffFormKey} /> : null}
      <FormSelectDropdown
        label='Event Type:'
        formKey={eventTypeFormKey}
        options={[
          { value: 'timed', label: 'Timed' },
          { value: 'oneshot', label: 'One Shot' },
        ]}
      />
      {eType === 'timed' ? (
        <FormNumberInput label='Duration (Seconds):' formKey={durationFormKey} />
      ) : null}
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
    </div>
  );
}
