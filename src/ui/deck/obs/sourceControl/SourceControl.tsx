import React, { ReactNode, useEffect, useRef, useState } from 'react';
import { faEye, faEyeSlash, faPlus, faMinus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { KeyedObject } from '../../../Types';
import {
  Border,
  Box,
  Button,
  Columns,
  StyleSize,
  StyleSizeButton,
  useOSC,
} from '@spooder/webui-component-library';
import useOBS from '../../../../app/hooks/useOBS';

export default function SourceControl() {
  const { addListener, removeListener } = useOSC();
  const { getObsControlApi, getObsFetchApi } = useOBS();
  const { getCurrentProgramSceneQuery, getSceneItemListQuery, getGroupSceneItemListQuery } =
    getObsFetchApi();
  const { getCurrentProgramScene } = getCurrentProgramSceneQuery();
  const { getSceneItemList } = getSceneItemListQuery();
  const { getGroupSceneItemList } = getGroupSceneItemListQuery();
  const { getSetSceneItemEnabled } = getObsControlApi();
  const { setSceneItemEnabled } = getSetSceneItemEnabled();
  const [currentProgramScene, setCurrentProgramScene] = useState<string>('');
  const currentProgramSceneRef = useRef<string>('');
  const [sceneItems, setSceneItems] = useState<KeyedObject>({});
  const [groups, setGroups] = useState<KeyedObject>({});

  // Add refs to track current state
  const groupsRef = useRef<KeyedObject>({});
  const sceneItemsRef = useRef<KeyedObject>({});

  // Update refs when state changes
  useEffect(() => {
    groupsRef.current = groups;
  }, [groups]);

  useEffect(() => {
    sceneItemsRef.current = sceneItems;
  }, [sceneItems]);

  useEffect(() => {
    getCurrentProgramScene().then((response) => {
      refreshSceneItems(response.data.data.currentProgramSceneName);
    });

    addListener('/obs/event/CurrentProgramSceneChanged', programSceneChanged);
    addListener('/obs/event/SceneItemEnableStateChanged', sceneItemEnableStateChanged);

    return () => {
      removeListener('/obs/event/CurrentProgramSceneChanged');
      removeListener('/obs/event/SceneItemEnableStateChanged');
    };
  }, []);

  async function refreshSceneItems(newProgramSceneName: string) {
    setCurrentProgramScene(newProgramSceneName);
    currentProgramSceneRef.current = newProgramSceneName;
    const newSceneItemListResponse = await getSceneItemList(newProgramSceneName);
    console.log('NEW SCENE ITEMS', newSceneItemListResponse);
    const newSceneItemsRaw = newSceneItemListResponse.data.data.sceneItems;

    const sceneItemList: KeyedObject = {};
    const groupList: KeyedObject = {};

    for (let sceneItem of newSceneItemsRaw) {
      console.log('SCENE ITEM', sceneItem);
      sceneItemList[sceneItem.sceneItemIndex] = {
        id: sceneItem.sceneItemId,
        name: sceneItem.sourceName,
        enabled: sceneItem.sceneItemEnabled,
        locked: sceneItem.sceneItemLocked,
      };
      if (sceneItem.isGroup) {
        const newGroupSceneItemListResponse = await getGroupSceneItemList(sceneItem.sourceName);
        const newGroupSceneItemsRaw = newGroupSceneItemListResponse.data.data.sceneItems;

        const newGroupSceneItems: KeyedObject = {};

        for (let groupSceneItem of newGroupSceneItemsRaw) {
          newGroupSceneItems[groupSceneItem.sceneItemIndex] = {
            id: groupSceneItem.sceneItemId,
            name: groupSceneItem.sourceName,
            enabled: groupSceneItem.sceneItemEnabled,
            locked: groupSceneItem.sceneItemLocked,
          };
        }
        groupList[sceneItem.sourceName] = {
          items: newGroupSceneItems,
          expanded: false,
        };

        console.log('newGroupSceneItemListResponse', newGroupSceneItemListResponse);
      }
    }

    setSceneItems(sceneItemList);
    setGroups(groupList);
  }

  if (!sceneItems) {
    return null;
  }

  function programSceneChanged(data: any) {
    refreshSceneItems(data.args[0]);
  }

  function sceneItemEnableStateChanged(data: any) {
    updateSceneItems(data);
  }

  function updateSceneItems(data: any) {
    const changedSceneItem = JSON.parse(data.args[0]);
    const { sceneItemEnabled, sceneItemId, sceneName } = changedSceneItem;

    console.log('Scene item change:', { sceneItemEnabled, sceneItemId, sceneName });

    console.log(
      'IS GROUP',
      Object.keys(groupsRef.current),
      sceneName,
      Object.keys(groupsRef.current).includes(sceneName),
    );

    if (Object.keys(groupsRef.current).includes(sceneName)) {
      setGroups((prevGroups) => {
        const newGroups = { ...prevGroups };
        const group = newGroups[sceneName];
        if (group && group.items) {
          // Find the item by ID in the group
          for (let itemKey in group.items) {
            if (group.items[itemKey].id === sceneItemId) {
              console.log(
                'Updating group item:',
                itemKey,
                'from',
                group.items[itemKey].enabled,
                'to',
                sceneItemEnabled,
              );
              newGroups[sceneName] = {
                ...group,
                items: {
                  ...group.items,
                  [itemKey]: {
                    ...group.items[itemKey],
                    enabled: sceneItemEnabled,
                  },
                },
              };
              break;
            }
          }
        }
        console.log('GROUP SCENE ITEM CHANGE', newGroups);
        return newGroups;
      });
    } else {
      console.log('SCENE ITEM CHANGE');
      setSceneItems((prevSceneItems) => {
        const newSceneItems = { ...prevSceneItems };
        // Find the item by ID in scene items
        for (let itemKey in newSceneItems) {
          if (newSceneItems[itemKey].id === sceneItemId) {
            console.log(
              'Updating scene item:',
              itemKey,
              'from',
              newSceneItems[itemKey].enabled,
              'to',
              sceneItemEnabled,
            );
            newSceneItems[itemKey] = {
              ...newSceneItems[itemKey],
              enabled: sceneItemEnabled,
            };
            break;
          }
        }
        return newSceneItems;
      });
    }
  }

  function toggleVisible(sceneName: string, sceneItemId: any, sceneItemEnabled: boolean) {
    setSceneItemEnabled(sceneName, sceneItemId, sceneItemEnabled);
  }

  function expandGroup(groupName: string) {
    let newGroups = { ...groups };
    console.log(groups, groupName);
    newGroups[groupName] = { ...newGroups[groupName], expanded: !newGroups[groupName].expanded };
    setGroups(newGroups);
  }

  let groupElements = [] as ReactNode[];

  for (let g in groups) {
    let thisGroupSceneItem = { id: -1, name: '', enabled: false };
    for (let item in sceneItems) {
      if (sceneItems[item].name == g) {
        thisGroupSceneItem = sceneItems[item];
      }
    }

    const visibleIcon = thisGroupSceneItem.enabled ? faEye : faEyeSlash;

    console.log('EXPANDED', groups[g].expanded);

    groupElements.push(
      <Border key={g + 'group-scene-item'}>
        <Box flexFlow='row'>
          <Columns spacing='medium' padding='medium'>
            <Button
              width={StyleSizeButton.large}
              label={thisGroupSceneItem.name}
              icon={groups[g].expanded ? faArrowLeft : visibleIcon}
              iconPosition='bottom'
              onClick={() => {
                groups[g].expanded
                  ? expandGroup(thisGroupSceneItem.name)
                  : toggleVisible(
                      currentProgramScene,
                      thisGroupSceneItem.id,
                      !thisGroupSceneItem.enabled,
                    );
              }}
              onLongPress={() => expandGroup(thisGroupSceneItem.name)}
              iconGap={StyleSize.small}
              truncate
            />
            {groups[g].expanded
              ? Object.keys(groups[g].items).map((itemIndex: string) => {
                  const item = groups[g].items[itemIndex];
                  return (
                    <Button
                      key={g + '-' + item.id}
                      width={StyleSizeButton.large}
                      label={item.name}
                      icon={item.enabled ? faEye : faEyeSlash}
                      iconPosition='bottom'
                      iconGap={StyleSize.small}
                      onClick={() => {
                        toggleVisible(g, item.id, !item.enabled);
                      }}
                      truncate
                    />
                  );
                })
              : null}
          </Columns>
        </Box>
      </Border>,
    );
  }

  const regularSceneItems = [] as ReactNode[];
  for (let s in sceneItems) {
    if (!Object.keys(groups).includes(sceneItems[s].name)) {
      regularSceneItems.push(
        <Button
          key={s + 'regular-scene-item'}
          width={StyleSizeButton.large}
          label={sceneItems[s].name}
          icon={sceneItems[s].enabled ? faEye : faEyeSlash}
          iconPosition='bottom'
          onClick={() => {
            toggleVisible(currentProgramScene, sceneItems[s].id, !sceneItems[s].enabled);
          }}
          iconGap='small'
          truncate
        />,
      );
    }
  }

  return (
    <Border borderBottom>
      <Box flexFlow='row' overflow='auto'>
        <Columns spacing='medium' padding='medium'>
          {groupElements}
        </Columns>
        <Columns spacing='medium' padding='medium'>
          {regularSceneItems}
        </Columns>
      </Box>
    </Border>
  );
}
