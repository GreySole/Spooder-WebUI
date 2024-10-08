import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey } from '../../FormKeys';
import { ReactNode } from 'react';
import FormNumberInput from '../../../common/input/form/FormNumberInput';
import FormSelectDropdown from '../../../common/input/form/FormSelectDropdown';
import { SelectOption } from '../../../../Types';

interface ObsSwitchScenesInputProps {
  formKey: string;
  sceneOptions: SelectOption[];
}

export default function ObsSwitchScenesInput(props: ObsSwitchScenesInputProps) {
  const { formKey, sceneOptions } = props;

  const { watch } = useFormContext();

  const itemOffFormKey = buildKey(formKey, 'itemOff');
  const itemOnFormKey = buildKey(formKey, 'itemOn');
  const durationFormKey = buildKey(formKey, 'duration');
  const delayFormKey = buildKey(formKey, 'delay');
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  return (
    <div className='command-content'>
      <FormSelectDropdown label='Scene On:' formKey={itemOnFormKey} options={sceneOptions} />
      {eType === 'timed' ? (
        <FormSelectDropdown label='Scene Off:' formKey={itemOffFormKey} options={sceneOptions} />
      ) : null}
      <FormSelectDropdown
        label='Event Type:'
        formKey={eventTypeFormKey}
        options={[
          { label: 'Timed', value: 'timed' },
          { label: 'One Shot', value: 'oneshot' },
        ]}
      />
      <FormNumberInput label='Duration (Seconds):' formKey={durationFormKey} />
      <FormNumberInput label='Delay (Milliseconds):' formKey={delayFormKey} />
    </div>
  );
}
