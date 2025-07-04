import React from 'react';
import { useFormContext } from 'react-hook-form';
import useOBS from '../../../../../app/hooks/useOBS';
import { buildCommandKey, buildKey } from '../../FormKeys';
import { EventCommandProps } from '../../../../Types';
import {
  Box,
  Expandable,
  FormNumberInput,
  FormSelectDropdown,
  Stack,
} from '@greysole/spooder-component-library';
import ObsEnableSceneItemInput from './ObsEnabledSceneItemInput';
import ObsSetInputMuteInput from './ObsSetInputMuteInput';
import ObsSwitchScenesInput from './ObsSwitchScenesInput';
import ObsLogin from '../../../../deck/obs/login/ObsLogin';

export default function EventOBSCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { getScenes, getObsSettings, getObsStatus } = useOBS();
  const { data: obsStatus, isLoading: obsStatusLoading, error: obsStatusError } = getObsStatus();
  const { data: obsData, isLoading: obsLoading, error: obsError } = getObsSettings();
  const formKey = buildCommandKey(eventName, commandIndex);
  const { register, watch } = useFormContext();

  const commandFunctionFormKey = buildKey(formKey, 'function');
  const commandFunction = watch(commandFunctionFormKey);

  const eTypeFormKey = buildKey(formKey, 'etype');
  const eType = watch(eTypeFormKey);

  const durationKey = buildKey(formKey, 'duration');

  if (obsLoading || obsError || obsStatusLoading || obsStatusError) {
    return null;
  }

  if (obsStatus.connected == false) {
    return (
      <Stack spacing='medium'>
        <label>
          OBS not connected. Connect to OBS remote in Deck Mode and refresh. Saving now will not
          affect any settings in place.
        </label>
        <Expandable label='Connect to OBS'>
          <ObsLogin obsConfig={obsData} />
        </Expandable>
      </Stack>
    );
  }

  let commandContent = null;
  switch (commandFunction) {
    case 'setinputmute':
      commandContent = <ObsSetInputMuteInput formKey={formKey} />;
      break;
    case 'switchscenes':
      commandContent = <ObsSwitchScenesInput formKey={formKey} />;
      break;
    case 'enablesceneitem':
      commandContent = <ObsEnableSceneItemInput formKey={formKey} />;
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
