import React from 'react';
import { useFormContext } from 'react-hook-form';
import { buildKey } from '../../FormKeys';
import { SelectOption } from '../../../../Types';
import {
  FormSelectDropdown,
  FormBoolSwitch,
  FormNumberInput,
} from '@greysole/spooder-component-library';
import useOBS from '../../../../../app/hooks/useOBS';

interface ObsEnableSceneItemInputProps {
  formKey: string;
}

export default function ObsEnableSceneItemInput(props: ObsEnableSceneItemInputProps) {
  const { formKey } = props;

  const { getScenes, getObsSettings } = useOBS();
  const { data: obsData, isLoading: obsLoading, error: obsError } = getObsSettings();
  const { data: sceneData, isLoading: scenesLoading, error: scenesError } = getScenes();

  const { watch } = useFormContext();
  const valueOffFormKey = buildKey(formKey, 'itemOff');
  const valueOnFormKey = buildKey(formKey, 'itemOn');
  const sceneFormKey = buildKey(formKey, 'item');
  const itemFormKey = buildKey(formKey, 'item');
  const durationFormKey = buildKey(formKey, 'duration');
  const delayFormKey = buildKey(formKey, 'delay');
  const eventTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eventTypeFormKey, '');
  const scene = watch(sceneFormKey);

  if (obsLoading || obsError || scenesLoading || scenesError) {
    return null;
  }

  const sceneOptions = sceneData.scenes
    .map((scene: any) => ({ label: scene.sceneName, value: scene.sceneName }))
    .unshift({ value: '', label: 'Choose Scene' });

  let sceneItemOptions = [{ value: '', label: 'Choose Item' }];
  let sceneIndex = -1;
  Object.keys(obsData.scenes).forEach((key: string) => {
    if (scene == obsData.scenes[key].sceneName) {
      sceneIndex = parseInt(key);
    }
  });

  for (let si in obsData.sceneItems[sceneIndex]) {
    sceneItemOptions.push({
      value: obsData.sceneItems[sceneIndex][si].sceneItemId,
      label: obsData.sceneItems[sceneIndex][si].sourceName,
    });
  }

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
