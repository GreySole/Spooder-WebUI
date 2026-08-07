import React, { ReactNode, useEffect, useState } from 'react';
import { faTv, faArrowRight, faTableColumns } from '@fortawesome/free-solid-svg-icons';
import { KeyedObject } from '../../../Types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Border,
  Box,
  Button,
  Columns,
  Stack,
  StyleSizeButton,
  useOSC,
} from '@spooder/webui-component-library';
import useOBS from '../../../../app/hooks/useOBS';

export default function SceneController() {
  const { addListener, removeListener } = useOSC();

  const { getObsFetchApi, getObsControlApi } = useOBS();
  const { getSceneListQuery, getStudioModeEnabledQuery } = getObsFetchApi();
  const { getSceneList } = getSceneListQuery();
  const { getStudioModeEnabled } = getStudioModeEnabledQuery();

  const { getTransition, getSetCurrentPreviewScene, getSetCurrentProgramScene, getSetStudioMode } =
    getObsControlApi();
  const { transition } = getTransition();
  const { setCurrentPreviewScene } = getSetCurrentPreviewScene();
  const { setCurrentProgramScene } = getSetCurrentProgramScene();
  const { setStudioMode } = getSetStudioMode();

  const [currentProgramScene, setCurrentProgramSceneState] = useState<String | undefined>();
  const [currentPreviewScene, setCurrentPreviewSceneState] = useState<String | undefined>();
  const [scenes, setScenes] = useState<KeyedObject | undefined>();
  const [studioMode, setStudioModeState] = useState<Boolean>(false);

  useEffect(() => {
    getSceneList().then((response) => {
      setCurrentPreviewSceneState(response.data.data.currentPreviewSceneName);
      setCurrentProgramSceneState(response.data.data.currentProgramSceneName);
      setScenes(response.data.data.scenes);
    });
    getStudioModeEnabled().then((response) => {
      setStudioModeState(response.data.data.studioModeEnabled);
    });
    addListener('/obs/event/StudioModeStateChanged', studioModeChanged);
    addListener('/obs/event/CurrentProgramSceneChanged', programSceneChanged);
    addListener('/obs/event/CurrentPreviewSceneChanged', previewSceneChanged);

    return () => {
      removeListener('/obs/event/StudioModeStateChanged');
      removeListener('/obs/event/CurrentProgramSceneChanged');
      removeListener('/obs/event/CurrentPreviewSceneChanged');
    };
  }, []);

  console.log('PROGRAM SCENE', currentProgramScene);

  if (!scenes) {
    return null;
  }

  function programSceneChanged(data: any) {
    setCurrentProgramSceneState(data.args[0]);
  }

  function previewSceneChanged(data: any) {
    setCurrentPreviewSceneState(data.args[0]);
  }

  function studioModeChanged(data: any) {
    setStudioModeState(data.args[0]);
  }

  function setScene(sceneName: any) {
    if (studioMode) {
      setCurrentPreviewScene(sceneName);
    } else {
      setCurrentProgramScene(sceneName);
    }
  }

  function toggleStudioMode() {
    console.log('TOGGLE STUDIO MODE');
    setStudioMode(!studioMode);
  }

  function startTransition() {
    transition();
  }

  let sceneButtons = [] as ReactNode[];
  for (let s in scenes) {
    sceneButtons.push(
      <Button
        width='large'
        className={
          'scene-controller-scene-button ' +
          (currentProgramScene == scenes[s].sceneName ? 'program ' : '') +
          (currentPreviewScene == scenes[s].sceneName && studioMode == true ? 'preview' : '')
        }
        label={scenes[s].sceneName}
        icon={faTv}
        iconPosition='bottom'
        iconGap='small'
        truncate
        onClick={() => setScene(scenes[s].sceneName)}
      />,
    );
  }

  return (
    <Border borderBottom>
      <Box flexFlow='column' alignItems='center' padding='medium'>
        <Columns spacing='medium'>
          <Button label='Studio Mode' icon={faTableColumns} onClick={() => toggleStudioMode()} />
          <Button label='Transition' icon={faArrowRight} onClick={() => startTransition()} />
        </Columns>
        <Box width='100%' flexFlow='row' overflow='auto'>
          <Columns spacing='medium' margin='medium'>
            {sceneButtons}
          </Columns>
        </Box>
      </Box>
    </Border>
  );
}
