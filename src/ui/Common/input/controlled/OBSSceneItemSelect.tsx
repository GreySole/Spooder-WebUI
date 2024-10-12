import React from 'react';
import { useFormContext } from 'react-hook-form';
import useOBS from '../../../../app/hooks/useOBS';
import { buildKey } from '../../../Tabs/EventsTab/FormKeys';
import SelectDropdown from './SelectDropdown';
import { KeyedObject } from '../../../Types';
import { useState } from 'react';

interface OBSChannelSelectProps {
  label: string;
  value: KeyedObject;
  onChange: (value: string) => void;
}

export default function FormOBSSceneItemSelect(props: OBSChannelSelectProps) {
  const { label, value, onChange } = props;
  const { getScenes } = useOBS();
  const { watch } = useFormContext();
  const [sceneIndex, setSceneIndex] = useState<number>(-1);
  const { data: sceneData, isLoading: scenesLoading, error: scenesError } = getScenes();
  if (scenesLoading || scenesError) {
    return <div className='obs-sceneitem-select'>Check OBS Connection</div>;
  }

  const sceneOptions = sceneData.scenes
    .map((scene: any) => ({ label: scene.sceneName, value: scene.sceneName }))
    .unshift({ value: '', label: 'Choose Scene' });

  const sceneItemOptions = [{ value: '', label: 'Choose Item' }];

  for (let si in sceneData.sceneItems[sceneIndex]) {
    sceneItemOptions.push({
      value: sceneData.sceneItems[sceneIndex][si].sceneItemId,
      label: sceneData.sceneItems[sceneIndex][si].sourceName,
    });
  }

  const onSceneChange = (sceneName: string) => {
    Object.keys(sceneData.scenes).forEach((key: string) => {
      if (key == sceneData.scenes[key].sceneName) {
        setSceneIndex(parseInt(key));
      }
    });
  };

  const onSceneItemChange = (sceneItemId: string) => {};

  return (
    <label className='obs-sceneitem-select'>
      {label}
      <SelectDropdown
        label='Scene'
        options={sceneOptions}
        value={value.scene}
        onChange={(value) => onSceneChange(value)}
      />
      <SelectDropdown
        label='Item'
        options={sceneItemOptions}
        value={value.item}
        onChange={(value) => onSceneItemChange(value)}
      />
    </label>
  );
}
