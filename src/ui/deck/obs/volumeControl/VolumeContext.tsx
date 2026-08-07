import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import { KeyedObject } from '../../../Types';
import { useOSC } from '@spooder/webui-component-library';
import useOBS from '../../../../app/hooks/useOBS';
import { current } from '@reduxjs/toolkit';

export const ObsWebsocketContext = createContext({
  inputs: {} as KeyedObject,
  meters: {} as KeyedObject,
  meterNames: {} as KeyedObject,
  groups: {} as KeyedObject,
  isReady: false,
});

export function useObsWebsocketContext() {
  return useContext(ObsWebsocketContext);
}

interface ObsWebsocketProviderProps {
  children: ReactNode;
}

function usePrevious(value: any) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

export const ObsWebsocketProvider = (props: ObsWebsocketProviderProps) => {
  const { children } = props;

  const { addListener, removeListener, sendOSC } = useOSC();
  const { getObsFetchApi } = useOBS();
  const { getVolumeDeckQuery, getCurrentProgramSceneQuery } = getObsFetchApi();
  const { getVolumeDeck } = getVolumeDeckQuery();
  const [inputs, setInputs] = useState<KeyedObject>({});
  const [meters, setMeters] = useState<KeyedObject>({});
  const [meterNames, setMeterNames] = useState<KeyedObject>({});
  const [groups, setGroups] = useState<KeyedObject>({});
  const [isReady, setIsReady] = useState<boolean>(false);
  const lastUpdateTime = useRef(Date.now());
  const currentTime = useRef(Date.now());

  function activateInputVolumeMeters() {
    sendOSC('/obs/event/InputVolumeMeters', 1);
  }

  function programSceneChanged(data: any) {
    getVolumeDeck().then((response) => {
      const volumeData = response.data.data;
      getVolumes(volumeData);
    });
  }

  function getVolumes(data: any) {
    const rawInputs = data.items;
    const rawGroups = data.groups;
    const newGroups: KeyedObject = {};
    const newVolumes: KeyedObject = {};
    for (let i in rawInputs) {
      if (rawInputs[i].volumeData != null) {
        newVolumes[rawInputs[i].name] = rawInputs[i];
      }
      if (rawGroups[rawInputs[i].name] != null) {
        newGroups[rawInputs[i].name] = {
          items: rawGroups[rawInputs[i].name],
          enabled: rawInputs[i].enabled,
          expanded: false,
          groupMuted: false,
          id: rawInputs[i].id,
        };
      }
    }

    for (let g in newGroups) {
      let isMuted = true;
      for (let s in newGroups[g].items) {
        if (newVolumes[newGroups[g].items[s].sourceName].volumeMuteData != null) {
          if (newVolumes[newGroups[g].items[s].sourceName].volumeMuteData.inputMuted == false) {
            isMuted = false;
            break;
          }
        }
      }
      newGroups[g].groupMuted = isMuted;
    }
    setInputs(newVolumes);
    setGroups(newGroups);
    setIsReady(true);
  }

  const volumeChanged = useCallback(
    (data: any) => {
      let volumeData = JSON.parse(data.args[0]);
      console.log('VOLUME CHANGED', volumeData);

      setInputs((prevInputs) => {
        let newInputs = { ...prevInputs };
        if (newInputs[volumeData.inputName]) {
          newInputs[volumeData.inputName] = {
            ...newInputs[volumeData.inputName],
            volumeData: {
              ...newInputs[volumeData.inputName].volumeData,
              inputVolumeMul: volumeData.inputVolumeMul,
              inputVolumeDb: volumeData.inputVolumeDb,
            },
          };
        }
        return newInputs;
      });
    },
    [setInputs],
  );

  //console.log('INPUTS', inputs);

  const muteStateChanged = useCallback(
    (data: any) => {
      let muteData = JSON.parse(data.args[0]);
      console.log('MUTE CHANGED', muteData);
      setInputs((prevInputs) => {
        let newInputs = { ...prevInputs };
        if (newInputs[muteData.inputName]) {
          newInputs[muteData.inputName] = {
            ...newInputs[muteData.inputName],
            volumeMuteData: {
              ...newInputs[muteData.inputName].volumeMuteData,
              inputMuted: muteData.inputMuted,
            },
          };
        }
        return newInputs;
      });
    },
    [setInputs],
  );

  const receiveMeter = useCallback(
    (data: any) => {
      currentTime.current = Date.now();
      try {
        const recMeters = JSON.parse(data.args[0]);
        let newMeters = Object.assign({}, meters);
        if (Object.keys(newMeters).length == 0) {
          newMeters = Array(recMeters.inputs.length).fill(null);
        }

        for (let meter in recMeters.inputs) {
          if (newMeters[meter] == null) {
            newMeters[meter] = recMeters.inputs[meter];
          }
          let meterLevel = newMeters[meter].inputLevelsMul;
          const recLevel = recMeters.inputs[meter].inputLevelsMul;

          if (meterLevel.length > 0) {
            for (let speaker in recLevel) {
              if (meterLevel[speaker] == null) {
                meterLevel[speaker] = [0, 0, 0];
              }
              const fallSpeed = Math.pow(0.001, 0.2);

              let targetLevel = Math.pow(recLevel[speaker][1], 0.2); // Or whatever your "raw" level is

              if (targetLevel > meterLevel[speaker][1]) {
                // Attack:  Instantly jump to the new level (or you could smooth this too)
                meterLevel[speaker][1] = targetLevel;
              } else {
                const elapsedTime = (currentTime.current - lastUpdateTime.current) / 1000; // Assuming time in milliseconds
                lastUpdateTime.current = currentTime.current;

                // Adjust the decay based on elapsed time
                meterLevel[speaker][1] = meterLevel[speaker][1] - fallSpeed * elapsedTime;
                // Ensure we don't go below 0
                meterLevel[speaker][1] = Math.max(0, meterLevel[speaker][1]);
              }
            }
          } else {
            newMeters[meter].inputLevelsMul = [
              [0, 0, 0],
              [0, 0, 0],
            ];
          }
        }

        setMeters(newMeters);
      } catch (error) {
        console.error('Error in receiveMeter:', error);
      }
    },
    [meters, setMeters, meterNames, setMeterNames],
  );

  useEffect(() => {
    // Function to get the keys of an object as a sorted array
    const getKeys = (obj: any) => Object.keys(obj).sort();
    // Compare the keys of the current and previous meters
    if (!meterNames || getKeys(meterNames).join(',') !== getKeys(meters).join(',')) {
      let newMeterNames = {} as KeyedObject;
      for (let m in meters) {
        newMeterNames[m] = meters[m].inputName;
      }
      setMeterNames(newMeterNames);
    }
  }, [meters, meterNames, setMeterNames]);

  useEffect(() => {
    getVolumeDeck().then((response) => {
      const volumeData = response.data.data;
      getVolumes(volumeData);
    });
    addListener('/obs/sound/InputVolumeMeters', receiveMeter);
    addListener('/obs/event/InputVolumeMeters', activateInputVolumeMeters);
    addListener('/obs/event/InputVolumeChanged', volumeChanged);
    addListener('/obs/event/InputMuteStateChanged', muteStateChanged);
    addListener('/obs/event/CurrentProgramSceneChanged', programSceneChanged);

    sendOSC('/obs/event/InputVolumeMeters', 1);

    return () => {
      removeListener('/obs/sound/InputVolumeMeters');
      removeListener('/obs/event/InputVolumeMeters');
      removeListener('/obs/event/InputVolumeChanged');
      removeListener('/obs/event/InputMuteStateChanged');
      removeListener('/obs/event/CurrentProgramSceneChanged');

      sendOSC('/obs/event/InputVolumeMeters', 0);
    };
  }, []);

  const value = {
    inputs,
    meters,
    meterNames,
    groups,
    isReady,
  };

  return <ObsWebsocketContext.Provider value={value}>{children}</ObsWebsocketContext.Provider>;
};
