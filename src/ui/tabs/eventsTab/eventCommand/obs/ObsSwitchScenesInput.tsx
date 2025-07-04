import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey } from '../../FormKeys';
import { SelectOption } from '../../../../Types';
import { FormSelectDropdown, FormNumberInput } from '@greysole/spooder-component-library';
import useOBS from '../../../../../app/hooks/useOBS';

interface ObsSwitchScenesInputProps {
  formKey: string;
}

export default function ObsSwitchScenesInput(props: ObsSwitchScenesInputProps) {
  const { formKey } = props;
  const { getScenes } = useOBS();
  const { data: sceneData, isLoading: scenesLoading, error: scenesError } = getScenes();

  const { watch } = useFormContext();

  console.log(sceneData);

  const sceneOptions = sceneData.scenes
    .map((scene: any) => ({ label: scene.sceneName, value: scene.sceneName }))
    .unshift({ value: '', label: 'Choose Scene' });

  const itemOffFormKey = buildKey(formKey, 'itemOff');
  const itemOnFormKey = buildKey(formKey, 'itemOn');
  const durationFormKey = buildKey(formKey, 'duration');
  const delayFormKey = buildKey(formKey, 'delay');
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');

  if (scenesLoading || scenesError) {
    return null;
  }

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
