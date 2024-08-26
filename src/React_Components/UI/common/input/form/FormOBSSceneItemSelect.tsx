import { useFormContext } from 'react-hook-form';
import useOBS from '../../../../../app/hooks/useOBS';
import { buildKey } from '../../../EventTable/FormKeys';
import FormSelectDropdown from './FormSelectDropdown';

interface FormOBSChannelSelectProps {
  formKey: string;
  label: string;
}

export default function FormOBSSceneItemSelect(props: FormOBSChannelSelectProps) {
  const { formKey, label } = props;
  const { getScenes } = useOBS();
  const { watch } = useFormContext();
  const { data: sceneData, isLoading: scenesLoading, error: scenesError } = getScenes();
  if (scenesLoading || scenesError) {
    return <div className='obs-sceneitem-select'>Check OBS Connection</div>;
  }

  const sceneKey = buildKey(formKey, 'scene');
  const scene = watch(sceneKey, '');
  const sceneItemKey = buildKey(formKey, 'sceneItem');

  const sceneOptions = sceneData.scenes
    .map((scene: any) => ({ label: scene.sceneName, value: scene.sceneName }))
    .unshift({ value: '', label: 'Choose Scene' });

  let sceneItemOptions = [{ value: '', label: 'Choose Item' }];
  let sceneIndex = -1;
  Object.keys(sceneData.scenes).forEach((key: string) => {
    if (key == sceneData.scenes[key].sceneName) {
      sceneIndex = parseInt(key);
    }
  });

  for (let si in sceneData.sceneItems[sceneIndex]) {
    sceneItemOptions.push({
      value: sceneData.sceneItems[sceneIndex][si].sceneItemId,
      label: sceneData.sceneItems[sceneIndex][si].sourceName,
    });
  }

  return (
    <label className='obs-sceneitem-select'>
      {label}
      <FormSelectDropdown formKey={sceneKey} label='Scene' options={sceneOptions} />
      <FormSelectDropdown formKey={sceneItemKey} label='Item' options={sceneItemOptions} />
    </label>
  );
}
