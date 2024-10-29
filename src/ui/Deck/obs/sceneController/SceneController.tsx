import React, { useEffect, useState } from 'react';
import OSC from 'osc-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTv, faArrowRight, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import './SceneController.css';
import { KeyedObject } from '../../../Types';
import { useOSC } from '../../../../app/context/OscContext';

export default function SceneController() {
  const { addListener, removeListener, sendOSC } = useOSC();
  const [currentProgramScene, setCurrentProgramScene] = useState<String>('');
  const [currentPreviewScene, setCurrentPreviewScene] = useState<String>('');
  const [scenes, setScenes] = useState<KeyedObject>({});
  const [studioMode, setStudioMode] = useState<Boolean>(false);

  useEffect(() => {
    addListener('/obs/get/scene/list', getSceneList);
    addListener('/obs/event/StudioModeStateChanged', studioModeChanged);
    addListener('/obs/get/studiomode', studioModeChanged);
    addListener('/obs/event/CurrentProgramSceneChanged', programSceneChanged);
    addListener('/obs/event/CurrentPreviewSceneChanged', previewSceneChanged);

    sendOSC('/obs/get/scene/list', 1);
    sendOSC('/obs/get/studiomode', 1);

    return () => {
      removeListener('/obs/get/scene/list');
      removeListener('/obs/event/StudioModeStateChanged');
      removeListener('/obs/get/studiomode');
      removeListener('/obs/event/CurrentProgramSceneChanged');
      removeListener('/obs/event/CurrentPreviewSceneChanged');
    };
  }, []);

  const [isReady, setIsReady] = useState<Boolean>(false);

  function programSceneChanged(data: any) {
    setCurrentProgramScene(data.args[0]);
  }

  function previewSceneChanged(data: any) {
    setCurrentPreviewScene(data.args[0]);
  }

  function studioModeChanged(data: any) {
    setStudioMode(data.args[0]);
  }

  function getSceneList(data: any) {
    let sceneData = JSON.parse(data.args[0]);
    setCurrentPreviewScene(sceneData.currentPreviewSceneName);
    setCurrentProgramScene(sceneData.currentProgramSceneName);
    setScenes(sceneData.scenes);
  }

  function setScene(sceneName: any) {
    if (studioMode) {
      sendOSC('/obs/set/scene/preview', sceneName);
    } else {
      sendOSC('/obs/set/scene/program', sceneName);
    }
  }

  function toggleStudioMode() {
    sendOSC('/obs/set/studiomode', !studioMode);
    setStudioMode(!studioMode);
  }

  function startTransition() {
    sendOSC('/obs/transition/Trigger', 1);
  }

  function truncate(str: string, n: number) {
    return str.length > n ? str.substring(0, n - 1) + '...' : str;
  }

  let sceneButtons = [] as React.JSX.Element[];
  for (let s in scenes) {
    sceneButtons.push(
      <div
        onClick={() => {
          setScene(scenes[s].sceneName);
        }}
        className={
          'scene-controller-scene-button ' +
          (currentProgramScene == scenes[s].sceneName ? 'program ' : '') +
          (currentPreviewScene == scenes[s].sceneName && studioMode == true ? 'preview' : '')
        }
      >
        <h2>{truncate(scenes[s].sceneName, 12)}</h2>
        <FontAwesomeIcon icon={faTv} size='2x' />
      </div>,
    );
  }

  return (
    <div className='deck-component deck-scene-controller'>
      <label className='deck-component-label'>Scenes</label>
      <div className='scene-controller-transition'>
        <div
          onClick={toggleStudioMode}
          className={'scene-controller-studiomode-button ' + (studioMode == true ? 'enabled' : '')}
        >
          <FontAwesomeIcon icon={faTableColumns} size='2x' />
        </div>
        <div onClick={startTransition} className='scene-controller-transition-button'>
          <FontAwesomeIcon icon={faArrowRight} size='2x' />
        </div>
      </div>
      <div className='scene-controller-container'>{sceneButtons}</div>
    </div>
  );
}
