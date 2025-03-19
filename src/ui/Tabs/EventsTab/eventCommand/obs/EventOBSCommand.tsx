import React from 'react';
import { useFormContext } from 'react-hook-form';
import useOBS from '../../../../../app/hooks/useOBS';
import { buildCommandKey, buildKey } from '../../FormKeys';
import { EventCommandProps } from '../../../../Types';
import {
  Box,
  FormNumberInput,
  FormSelectDropdown,
  Stack,
} from '@greysole/spooder-component-library';
import ObsEnableSceneItemInput from './ObsEnabledSceneItemInput';
import ObsSetInputMuteInput from './ObsSetInputMuteInput';
import ObsSwitchScenesInput from './ObsSwitchScenesInput';

export default function EventOBSCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { getScenes, getObsSettings, getObsStatus } = useOBS();
  const { data: obsStatus, isLoading: obsStatusLoading, error: obsStatusError } = getObsStatus();
  const { data: obsData, isLoading: obsLoading, error: obsError } = getObsSettings();
  const { data: sceneData, isLoading: scenesLoading, error: scenesError } = getScenes();
  const formKey = buildCommandKey(eventName, commandIndex);
  const { register, watch } = useFormContext();

  const commandFunctionFormKey = buildKey(formKey, 'function');
  const commandFunction = watch(commandFunctionFormKey);

  const sceneFormKey = buildKey(formKey, 'scene');
  const scene = watch(sceneFormKey);

  const eTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eTypeFormKey);

  const durationKey = buildKey(formKey, 'duration');

  if (
    obsLoading ||
    scenesLoading ||
    obsError ||
    scenesError ||
    obsStatusLoading ||
    obsStatusError
  ) {
    return null;
  }

  if (obsStatus.connected == false) {
    return (
      <Box>
        <label>
          OBS not connected. Connect to OBS remote in Deck Mode and refresh. Saving now will not
          affect any settings in place.
        </label>
      </Box>
    );
  }

  const inputItemOptions = sceneData.inputs
    .map((input: any) => ({ label: input.inputName, value: input.inputName }))
    .unshift({ value: '', label: 'Choose Input' });

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

  let commandContent = null;
  switch (commandFunction) {
    case 'setinputmute':
      commandContent = (
        <ObsSetInputMuteInput formKey={formKey} inputItemOptions={inputItemOptions} />
      );
      break;
    case 'switchscenes':
      commandContent = <ObsSwitchScenesInput formKey={formKey} sceneOptions={sceneOptions} />;
      break;
    case 'enablesceneitem':
      commandContent = (
        <ObsEnableSceneItemInput
          formKey={formKey}
          sceneOptions={sceneOptions}
          sceneItemOptions={sceneItemOptions}
        />
      );
      break;
  }

  return (
    <Stack spacing='medium'>
      <FormSelectDropdown
        label='Function'
        formKey={commandFunctionFormKey}
        options={[
          { value: 'setinputmute', label: 'Set Input Mute' },
          { value: 'switchscenes', label: 'Switch Scenes' },
          { value: 'enablesceneitem', label: 'Enable Scene Item' },
        ]}
      />
      {eType === 'timed' ? (
        <FormNumberInput label='Duration (Seconds)' formKey={durationKey} />
      ) : null}
      {commandContent}
    </Stack>
  );
}
