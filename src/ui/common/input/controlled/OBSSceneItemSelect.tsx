import React from 'react';
import { useFormContext } from 'react-hook-form';
import useOBS from '../../../../app/hooks/useOBS';
import { KeyedObject } from '../../../Types';
import { useState } from 'react';
import { SelectDropdown } from '@greysole/spooder-component-library';

interface OBSChannelPair {
  scene: string;
  sceneItem: string;
}

interface OBSChannelSelectProps {
  label: string;
  value: OBSChannelPair;
  onChange: (value: OBSChannelPair) => void;
}

export default function OBSSceneItemSelect(props: OBSChannelSelectProps) {
  const { label, value, onChange } = props;
  const { getScenes } = useOBS();
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
      if (key == sceneName) {
        setSceneIndex(parseInt(key));
        onChange({ scene: sceneName, sceneItem: '' });
      }
    });
  };

  const onSceneItemChange = (sceneItemId: string) => {
    onChange({ ...value, sceneItem: sceneItemId });
  };

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
        value={value.sceneItem}
        onChange={(value) => onSceneItemChange(value)}
      />
    </label>
  );
}
