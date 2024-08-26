import { useFormContext } from 'react-hook-form';
import useOBS from '../../../../../app/hooks/useOBS';
import { buildCommandKey, buildKey } from '../../FormKeys';
import FormBoolSwitch from '../../../common/input/form/FormBoolSwitch';
import ObsSetInputMuteInput from './ObsSetInputMuteInput';
import ObsSwitchScenesInput from './ObsSwitchScenesInput';
import ObsEnableSceneItemInput from './ObsEnabledSceneItemInput';
import { EventCommandProps } from '../../../../Types';

export default function EventOBSCommand(props: EventCommandProps) {
  const { eventName, commandIndex } = props;
  const { getScenes, getObsSettings } = useOBS();
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

  if (obsLoading || scenesLoading || obsError || scenesError) {
    return null;
  }
  if (Object.keys(obsData).length == 0 || obsData.status == 'notconnected') {
    return (
      <div className='command-props software'>
        <label>
          OBS not connected. Connect to OBS remote in Deck Mode and refresh. Saving now will not
          affect any settings in place.
        </label>
      </div>
    );
  }

  const oduration =
    eType == 'timed' ? (
      <label>
        Duration (Seconds):
        <input type='number' {...register(buildKey(formKey, 'duration'))} />
      </label>
    ) : null;

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

  let functionSelect = (
    <select value={commandFunction} {...register(commandFunctionFormKey)}>
      <option value='setinputmute'>Set Input Mute</option>
      <option value='switchscenes'>Switch Scenes</option>
      <option value='enablesceneitem'>Enable Scene Item</option>
    </select>
  );

  return (
    <div className='command-props software'>
      <label>Function: {functionSelect}</label>
      {commandContent}
    </div>
  );
}
