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
import { useOSC } from '../../../../app/context/OscContext';

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
  const [inputs, setInputs] = useState<KeyedObject>({});
  const [meters, setMeters] = useState<KeyedObject>({});
  const [meterNames, setMeterNames] = useState<KeyedObject>({});
  const [groups, setGroups] = useState<KeyedObject>({});
  const [isReady, setIsReady] = useState<boolean>(false);

  function activateInputVolumeMeters() {
    sendOSC('/obs/event/InputVolumeMeters', 1);
  }

  function programSceneChanged(data: any) {
    sendOSC('/obs/get/input/volumelist', 1);
  }

  function getVolumes(data: any) {
    let rawInputs = JSON.parse(data.args[0]);
    let rawGroups = Object.assign(rawInputs.groups);
    let newGroups: KeyedObject = {};
    let newVolumes: KeyedObject = {};
    for (let i in rawInputs.items) {
      if (rawInputs.items[i].volumeData != null) {
        newVolumes[rawInputs.items[i].name] = rawInputs.items[i];
      }
      if (rawGroups[rawInputs.items[i].name] != null) {
        newGroups[rawInputs.items[i].name] = {
          items: rawGroups[rawInputs.items[i].name],
          enabled: rawInputs.items[i].enabled,
          expanded: false,
          groupMuted: false,
          id: rawInputs.items[i].id,
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
    console.log('GET VOLUMES', newVolumes, newGroups);
    setInputs(newVolumes);
    setGroups(newGroups);
    setIsReady(true);
  }

  const volumeChanged = useCallback(
    (data: any) => {
      let volumeData = JSON.parse(data.args[0]);
      console.log('VOLUME CHANGED', volumeData);

      setInputs((prevInputs) => {
        let newInputs = Object.assign({}, prevInputs);
        if (newInputs[volumeData.inputName]) {
          newInputs[volumeData.inputName].volumeData.inputVolumeMul = volumeData.inputVolumeMul;
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
        let newInputs = Object.assign({}, prevInputs);
        if (newInputs[muteData.inputName]) {
          newInputs[muteData.inputName].volumeMuteData.inputMuted = muteData.inputMuted;
        }
        return newInputs;
      });
    },
    [setInputs],
  );

  const receiveMeter = useCallback(
    (data: any) => {
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

              if (Math.pow(recLevel[speaker][1], 0.2) > meterLevel[speaker][1]) {
                meterLevel[speaker][1] = Math.pow(recLevel[speaker][1], 0.2);
              } else {
                meterLevel[speaker][1] = meterLevel[speaker][1] - 0.005;
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
    addListener('/obs/sound/InputVolumeMeters', receiveMeter);
    addListener('/obs/event/InputVolumeMeters', activateInputVolumeMeters);
    addListener('/obs/get/input/volumelist', getVolumes);
    addListener('/obs/event/InputVolumeChanged', volumeChanged);
    addListener('/obs/event/InputMuteStateChanged', muteStateChanged);
    addListener('/obs/event/CurrentProgramSceneChanged', programSceneChanged);

    sendOSC('/obs/event/InputVolumeMeters', 1);
    sendOSC('/obs/get/input/volumelist', 1);

    return () => {
      removeListener('/obs/sound/InputVolumeMeters');
      removeListener('/obs/event/InputVolumeMeters');
      removeListener('/obs/get/input/volumelist');
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
