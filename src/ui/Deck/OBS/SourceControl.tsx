import React, { useEffect, useState } from 'react';
import OSC from 'osc-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import './SourceControl.css';
import { KeyedObject } from '../../Types';
import { useOSC } from '../../../app/context/OscContext';

export default function SourceControl() {
  const { addListener, removeListener, sendOSC } = useOSC();
  const [currentProgramScene, setCurrentProgramScene] = useState<string>('');
  const [currentPreviewScene, setCurrentPreviewScene] = useState<string>('');
  const [studioMode, setStudioMode] = useState<boolean>(false);
  const [sceneItems, setSceneItems] = useState<KeyedObject>({});
  const [groups, setGroups] = useState<KeyedObject>({});

  useEffect(() => {
    addListener('/obs/get/scene/program', getProgramScene);
    addListener('/obs/get/scene/itemlist', getSceneItemList);
    addListener('/obs/get/studiomode', studioModeChanged);
    addListener('/obs/event/StudioModeStateChanged', studioModeChanged);
    addListener('/obs/event/CurrentProgramSceneChanged', programSceneChanged);
    addListener('/obs/event/CurrentPreviewSceneChanged', previewSceneChanged);
    addListener('/obs/event/SceneItemEnableStateChanged', sceneItemEnableStateChanged);

    sendOSC('/obs/get/scene/itemlist', 1);
    sendOSC('/obs/get/studiomode', 1);

    return () => {
      removeListener('/obs/get/scene/program');
      removeListener('/obs/get/scene/itemlist');
      removeListener('/obs/get/studiomode');
      removeListener('/obs/event/StudioModeStateChanged');
      removeListener('/obs/event/CurrentProgramSceneChanged');
      removeListener('/obs/event/CurrentPreviewSceneChanged');
      removeListener('/obs/event/SceneItemEnableStateChanged');
    };
  });

  function programSceneChanged(data: any) {
    sendOSC('/obs/get/scene/itemlist', 1);
    setCurrentProgramScene(data.args[0]);
  }

  function previewSceneChanged(data: any) {
    setCurrentPreviewScene(data.args[0]);
  }

  function sceneItemEnableStateChanged(data: any) {
    let sceneItemData = JSON.parse(data.args[0]);

    if (Object.keys(groups).includes(sceneItemData.sceneName)) {
      let newGroups = Object.assign(groups);
      for (let sceneItem in newGroups[sceneItemData.sceneName].items) {
        if (
          newGroups[sceneItemData.sceneName].items[sceneItem].sceneItemId ==
          sceneItemData.sceneItemId
        ) {
          newGroups[sceneItemData.sceneName].items[sceneItem].sceneItemEnabled =
            sceneItemData.sceneItemEnabled;
          break;
        }
      }
      setGroups(newGroups);
    } else {
      let newItems: KeyedObject = Object.assign(sceneItems);
      for (let item in newItems) {
        if (newItems[item].id == sceneItemData.sceneItemId) {
          newItems[item].enabled = sceneItemData.sceneItemEnabled;
          break;
        }
      }
      setSceneItems(newItems);
    }
  }

  function studioModeChanged(data: any) {
    setStudioMode(data.args[0]);
  }

  function getProgramScene(data: any) {
    let sceneData = JSON.parse(data.args[0]);
    if (sceneData.currentProgramSceneName != null) {
      sendOSC('/obs/get/scene/itemlist', sceneData.currentProgramSceneName);
    }
    setCurrentProgramScene(sceneData.currentProgramSceneName);
  }

  function getSceneItemList(data: any) {
    let sceneItemData = JSON.parse(data.args[0]);

    let groupList: KeyedObject = {};
    for (let g in sceneItemData.groups) {
      groupList[g] = {
        items: sceneItemData.groups[g],
        expanded: false,
      };
    }

    setCurrentProgramScene(sceneItemData.currentProgramSceneName);
    setSceneItems(sceneItemData.items);
    setGroups(groupList);
  }

  function setScene(sceneName: any) {
    if (studioMode) {
      sendOSC('/obs/set/scene/preview', sceneName);
    } else {
      sendOSC('/obs/set/scene/program', sceneName);
    }
  }

  function toggleVisible(sceneName: string, sceneItemId: any, sceneItemEnabled: boolean) {
    sendOSC(
      '/obs/set/source/enabled',
      JSON.stringify({
        sceneName: sceneName,
        sceneItemId: sceneItemId,
        sceneItemEnabled: sceneItemEnabled,
      }),
    );
  }

  function expandGroup(e: any) {
    let groupName = e.currentTarget.getAttribute('name');
    let newGroups = Object.assign(groups);
    newGroups[groupName].expanded = !newGroups[groupName].expanded;
    setGroups(newGroups);
  }

  function truncate(str: string, n: number) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  }

  let groupElements = [<div></div>];

  for (let g in groups) {
    let thisGroupElement = <div></div>;
    let thisGroupSceneItem = { id: -1, name: '', enabled: false };
    for (let item in sceneItems) {
      if (sceneItems[item].name == g) {
        thisGroupSceneItem = sceneItems[item];
      }
    }

    let visibleIcon = faEye;
    if (thisGroupSceneItem.enabled) {
      visibleIcon = faEye;
    } else {
      visibleIcon = faEyeSlash;
    }
    let groupSceneItems = [] as React.JSX.Element[];
    if (groups[g].expanded) {
      for (let s in groups[g].items) {
        groupSceneItems.push(
          <div className='source-item'>
            <div className='source-item-name'>{groups[g].items[s].sourceName}</div>
            <div className='source-item-actions'>
              <FontAwesomeIcon
                name={groups[g].items[s].sourceName}
                icon={groups[g].items[s].sceneItemEnabled ? faEye : faEyeSlash}
                size='3x'
                onClick={() => {
                  toggleVisible(
                    g,
                    groups[g].items[s].sceneItemId,
                    !groups[g].items[s].sceneItemEnabled,
                  );
                }}
              />
            </div>
          </div>,
        );
      }
    }
    thisGroupElement = (
      <div className='source-group-item'>
        <div className='source-group-item-name'>{truncate(thisGroupSceneItem.name, 12)}</div>
        <div className='source-group-item-container'>
          <div className='source-group-item-actions'>
            <FontAwesomeIcon
              className='source-group-item-button'
              name={thisGroupSceneItem.name}
              icon={visibleIcon}
              size='3x'
              onClick={() => {
                toggleVisible(
                  currentProgramScene,
                  thisGroupSceneItem.id,
                  !thisGroupSceneItem.enabled,
                );
              }}
            />
            <FontAwesomeIcon
              className='source-group-item-button'
              name={thisGroupSceneItem.name}
              icon={groups[g].expanded ? faMinus : faPlus}
              onClick={expandGroup}
              size='2x'
            />
          </div>
          <div className='source-group-item-subitems'></div>
        </div>
      </div>
    );

    groupElements.push(
      <div className={'source-group-container ' + (groups[g].expanded ? 'expanded' : '')}>
        {thisGroupElement}
        {groupSceneItems}
      </div>,
    );
  }

  let regularSceneItems = [] as React.JSX.Element[];
  for (let s in sceneItems) {
    if (!Object.keys(groups).includes(sceneItems[s].name)) {
      regularSceneItems.push(
        <div className='source-item'>
          <div className='source-item-name'>{truncate(sceneItems[s].name, 12)}</div>
          <div className='source-item-actions'>
            <FontAwesomeIcon
              name={sceneItems[s].name}
              icon={sceneItems[s].enabled ? faEye : faEyeSlash}
              size='3x'
              onClick={() => {
                toggleVisible(currentProgramScene, sceneItems[s].id, !sceneItems[s].enabled);
              }}
            />
          </div>
        </div>,
      );
    }
  }

  return (
    <div className='deck-component deck-source-controller'>
      <label className='deck-component-label'>Sources</label>
      <div className='component-source-buttons'>
        {groupElements}
        {regularSceneItems}
      </div>
    </div>
  );
}
