import React, { useEffect, useState } from 'react';
import OSC from 'osc-js';
import './VolumeControl.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faVolumeMute,
  faVolumeHigh,
  faArrowCircleLeft,
  faCheck,
  faPlus,
  faMinus,
} from '@fortawesome/free-solid-svg-icons';
import { KeyedObject } from '../../Types';
import { useOSC } from '../../../app/context/OscContext';

export default function VolumeControl() {
  const { addListener, removeListener, sendOSC } = useOSC();
  const [inputs, setInputs] = useState<KeyedObject>({});
  const [prevInputs, setPrevInputs] = useState<KeyedObject>({});
  const [meters, setMeters] = useState<KeyedObject>({ inputs: {} });
  const [groups, setGroups] = useState<KeyedObject>({});
  const [volumes, setVolumes] = useState<KeyedObject>({});
  const [isReady, setIsReady] = useState<Boolean>(false);

  useEffect(() => {
    addListener('/obs/sound/InputVolumeMeters', receiveMeter);
    addListener('/obs/event/InputVolumeMeters', activateInputVolumeMeters);
    addListener('/obs/get/input/volumelist', getVolumes);
    addListener('/obs/get/input/volume', getVolume);
    addListener('/obs/get/input/mute', getMute);
    addListener('/obs/event/InputVolumeChanged', volumeChanged);
    addListener('/obs/event/InputMuteStateChanged', muteStateChanged);
    addListener('/obs/event/CurrentProgramSceneChanged', programSceneChanged);

    sendOSC('/obs/event/InputVolumeMeters', 1);
    sendOSC('/obs/get/input/volumelist', 1);

    setIsReady(true);

    return () => {
      removeListener('/obs/sound/InputVolumeMeters');
      removeListener('/obs/event/InputVolumeMeters');
      removeListener('/obs/get/input/volumelist');
      removeListener('/obs/get/input/volume');
      removeListener('/obs/get/input/mute');
      removeListener('/obs/event/InputVolumeChanged');
      removeListener('/obs/event/InputMuteStateChanged');
      removeListener('/obs/event/CurrentProgramSceneChanged');

      sendOSC('/obs/event/InputVolumeMeters', 0);
    };
  });

  function activateInputVolumeMeters() {
    sendOSC('/obs/event/InputVolumeMeters', 1);
  }

  function programSceneChanged(data: any) {
    sendOSC('/obs/get/input/volumelist', 1);
  }

  function getVolumes(data: any) {
    let inputs = JSON.parse(data.args[0]);
    let groups = Object.assign(inputs.groups);
    let newGroups: KeyedObject = {};
    let newVolumes = Object.assign(inputs);
    for (let i in inputs.items) {
      if (inputs.items[i].volumeData != null) {
        newVolumes[inputs.items[i].name] = inputs.items[i];
      }
      if (groups[inputs.items[i].name] != null) {
        newGroups[inputs.items[i].name] = {
          items: groups[inputs.items[i].name],
          enabled: inputs.items[i].enabled,
          expanded: false,
          groupMuted: false,
          id: inputs.items[i].id,
        };
      }
    }

    for (let g in newGroups) {
      let isMuted = true;
      for (let s in newGroups[g].items) {
        if (newVolumes[newGroups[g].items[s].sourceName].volumeMuteData != null) {
          if (newVolumes[newGroups[g].items[s].sourceName].volumeMuteData.inputMuted == false) {
            isMuted = false;
          }
        }
      }
      newGroups[g].groupMuted = isMuted;
    }

    /*setState(
      Object.assign(state, {
        prevInputs: JSON.parse(JSON.stringify(newVolumes)),
        inputs: newVolumes,
        groups: newGroups,
      }),
    );*/
  }

  function getVolume(data: any) {
    let volumeData = JSON.parse(data.args[0]);
    let newVolumes = Object.assign(volumes);
    newVolumes[volumeData.inputName] = volumeData.inputVolumeMul;
    setVolumes(newVolumes);
  }

  function getMute(data: any) {
    let muteObj = JSON.parse(data.args[0]);

    let newInputs = Object.assign(inputs);
    let newGroups = Object.assign(groups);
    newInputs[muteObj.inputName] = muteObj.inputMuted;
    for (let g in newGroups) {
      let isMuted = true;
      for (let s in newGroups[g].items) {
        if (newInputs[newGroups[g].items[s].sourceName].volumeMuteData != null) {
          if (newInputs[newGroups[g].items[s].sourceName].volumeMuteData.inputMuted == false) {
            isMuted = false;
          }
        }
      }
      newGroups[g].groupMuted = isMuted;
    }
    setInputs(newInputs);
    setGroups(newGroups);
  }

  function setVolume(e: any) {
    let inputName = e.currentTarget.getAttribute('inputname');
    let value = e.currentTarget.value;
    sendOSC(
      '/obs/set/input/volume',
      JSON.stringify({ inputName: inputName, value: parseFloat(value) ** 2 }),
    );
  }

  function revertVolume(inputName: string) {
    let newVolumes = Object.assign(inputs);
    newVolumes[inputName].volumeData.inputVolumeMul =
      prevInputs[inputName].volumeData.inputVolumeMul;
    sendOSC('/obs/set/input/volume',
      JSON.stringify({
        inputName: inputName,
        value: parseFloat(newVolumes[inputName].volumeData.inputVolumeMul),
      }));
    setInputs(newVolumes);
  }

  function commitVolume(inputName: string) {
    let newPrevVolumes = Object.assign(prevInputs);
    newPrevVolumes[inputName].volumeData.inputVolumeMul =
      inputs[inputName].volumeData.inputVolumeMul;
    setPrevInputs(newPrevVolumes);
  }

  function volumeChanged(data: any) {
    let volumeData = JSON.parse(data.args[0]);
    let newInputs = Object.assign(inputs);
    newInputs[volumeData.inputName].volumeData.inputVolumeMul = volumeData.inputVolumeMul;
    setInputs(newInputs);
  }

  function muteStateChanged(data: any) {
    let muteData = JSON.parse(data.args[0]);
    let newInputs = Object.assign(inputs);
    newInputs[muteData.inputName].volumeMuteData.inputMuted = muteData.inputMuted;
    setInputs(newInputs);
  }

  function receiveMeter(data: any) {
    let recMeters = JSON.parse(data.args[0]);
    if (isReady == true) {
      //Meter decay
      for (let meter in recMeters.inputs) {
        if (recMeters.inputs[meter].inputLevelsMul.length > 0) {
          for (let speaker in recMeters.inputs[meter].inputLevelsMul) {
            recMeters.inputs[meter].inputLevelsMul[speaker][1] = Math.pow(
              recMeters.inputs[meter].inputLevelsMul[speaker][1],
              0.2,
            );
            if (
              meters.inputs[meter]?.inputLevelsMul[speaker] &&
              recMeters.inputs[meter]?.inputLevelsMul[speaker]
            ) {
              if (
                meters.inputs[meter].inputLevelsMul[speaker].length ===
                recMeters.inputs[meter].inputLevelsMul[speaker].length
              ) {
                if (
                  recMeters.inputs[meter].inputLevelsMul[speaker][1] <
                  meters.inputs[meter].inputLevelsMul[speaker][1]
                ) {
                  recMeters.inputs[meter].inputLevelsMul[speaker][1] =
                    meters.inputs[meter].inputLevelsMul[speaker][1] - 0.01;
                  if (recMeters.inputs[meter].inputLevelsMul[speaker][1] < 0) {
                    recMeters.inputs[meter].inputLevelsMul[speaker][1] = 0;
                  }
                }
              }
            }
          }
        }
      }
      setMeters(recMeters);
    }
  }

  function truncate(str: string, n: number) {
    return str.length > n ? str.substr(0, n - 1) + '...' : str;
  }

  function toggleMute(inputName: string) {
    let inputMuted = !inputs[inputName].volumeMuteData.inputMuted;
    let newInputs = Object.assign(inputs);
    sendOSC('/obs/set/input/mute', JSON.stringify({ inputName: inputName, inputMuted: inputMuted }))
    newInputs[inputName].volumeMuteData.inputMuted = inputMuted;
    let newGroups = Object.assign(groups);
    for (let g in newGroups) {
      let isMuted = true;
      for (let s in newGroups[g].items) {
        if (newInputs[newGroups[g].items[s].sourceName].volumeMuteData != null) {
          if (newInputs[newGroups[g].items[s].sourceName].volumeMuteData.inputMuted == false) {
            isMuted = false;
          }
        }
      }
      newGroups[g].groupMuted = isMuted;
    }

    setInputs(newInputs);
    setGroups(newGroups);
  }

  function toggleGroupMute(inputName: string) {
    let newInputs = Object.assign(inputs);
    let newGroups = Object.assign(groups);
    let groupMuted = !newGroups[inputName].groupMuted;

    for (let s in newGroups[inputName].items) {
      sendOSC('/obs/set/input/mute',
        JSON.stringify({
          inputName: newGroups[inputName].items[s].sourceName,
          inputMuted: groupMuted,
        }))
    }

    newGroups[inputName].groupMuted = groupMuted;
    setGroups(newGroups);
  }

  function expandGroup(inputName: string) {
    let newGroups = Object.assign(groups);
    newGroups[inputName].expanded = !newGroups[inputName].expanded;
    setGroups(newGroups);
  }

  let meterElements = [] as React.JSX.Element[];
  let groupElements = [] as React.JSX.Element[];
  let groupItemElements = {} as KeyedObject;
  let groupNames = [] as string[];
  let groupLevel = {} as KeyedObject;
  for (let g in groups) {
    groupItemElements[g] = [];
    groupLevel[g] = {
      l: [0.0, 0.0, 0.0],
      r: [0.0, 0.0, 0.0],
      enabled: false,
    };
  }
  if (Object.keys(inputs).length == 0) {
    return <div className='deck-component deck-volume-control'></div>;
  }

  for (let m in meters.inputs) {
    let inputName: string = meters.inputs[m].inputName;
    for (let g in groups) {
      for (let s in groups[g].items) {
        if (groups[g].items[s].sourceName == inputName) {
          const volumeIsDifferent =
            inputs[inputName].volumeData.inputVolumeMul !=
            prevInputs[inputName].volumeData.inputVolumeMul;

          let volumeRevertButton = volumeIsDifferent ? (
            <button onClick={() => revertVolume(inputName)}>
              <FontAwesomeIcon icon={faArrowCircleLeft} />
            </button>
          ) : null;

          let volumeCommitButton = volumeIsDifferent ? (
            <button onClick={() => commitVolume(inputName)}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
          ) : null;
          if (
            inputs[inputName].volumeData.inputVolumeMul !=
            prevInputs[inputName].volumeData.inputVolumeMul
          ) {
          }
          groupNames.push(inputName);
          groupLevel[g].enabled = true;
          if (groups[g].expanded) {
            groupItemElements[g].push(
              <div className='deck-volume-meter'>
                <div className='deck-volume-meter-label'>
                  {truncate(meters.inputs[m].inputName, 16)}
                </div>
                <div className='deck-volume-meter-ui'>
                  <div
                    className='deck-volume-meter-bars'
                    key={inputName + '-' + meters.inputs[m].inputLevelsMul.join(',')}
                  >
                    <VolumeMeter lr='l' level={meters.inputs[m].inputLevelsMul[0]} />
                    <VolumeMeter lr='r' level={meters.inputs[m].inputLevelsMul[1]} />
                  </div>
                  <div className='deck-volume-control-slider'>
                    <input
                      key={inputName + '- Volume - ' + Object.keys(inputs).length}
                      onChange={() => setVolume(inputName)}
                      type='range'
                      min={0}
                      max={1}
                      step={0.01}
                      value={
                        inputs[inputName].volumeData.inputVolumeMul != null
                          ? Math.sqrt(inputs[inputName].volumeData.inputVolumeMul)
                          : 0
                      }
                    />
                  </div>
                  <div className='deck-source-buttons'>
                    {volumeCommitButton}
                    {volumeRevertButton}
                    <button onClick={() => toggleMute(inputName)}>
                      <FontAwesomeIcon
                        icon={
                          inputs[inputName].volumeMuteData.inputMuted ? faVolumeMute : faVolumeHigh
                        }
                      />
                    </button>
                  </div>
                </div>
              </div>,
            );
          }

          if (meters.inputs[m].inputLevelsMul.length > 0) {
            if (meters.inputs[m].inputLevelsMul[0][1] > groupLevel[g].l[1]) {
              groupLevel[g].l = meters.inputs[m].inputLevelsMul[0];
            }
            if (meters.inputs[m].inputLevelsMul[1][1] > groupLevel[g].r[1]) {
              groupLevel[g].r = meters.inputs[m].inputLevelsMul[1];
            }
          }
        }
      }
    }
    if (!groupNames.includes(inputName)) {
      if (inputs[inputName] != null) {
        let volumeRevertButton = (
          <button onClick={() => revertVolume(inputName)}>
            <FontAwesomeIcon icon={faArrowCircleLeft} />
          </button>
        );
        let volumeCommitButton = (
          <button onClick={() => commitVolume(inputName)}>
            <FontAwesomeIcon icon={faCheck} />
          </button>
        );

        meterElements.push(
          <div className='deck-volume-meter'>
            <div className='deck-volume-meter-label'>
              {truncate(meters.inputs[m].inputName, 16)}
            </div>
            <div className='deck-volume-meter-ui'>
              <div
                className='deck-volume-meter-bars'
                key={inputName + '-' + meters.inputs[m].inputLevelsMul.join(',')}
              >
                <VolumeMeter lr='l' level={meters.inputs[m].inputLevelsMul[0]} />
                <VolumeMeter lr='r' level={meters.inputs[m].inputLevelsMul[1]} />
              </div>
              <div className='deck-volume-control-slider'>
                <input
                  key={inputName + '- Volume - ' + Object.keys(inputs).length}
                  onChange={setVolume}
                  type='range'
                  min={0}
                  max={1}
                  step={0.01}
                  value={
                    inputs[inputName].volumeData.inputVolumeMul != null
                      ? Math.sqrt(inputs[inputName].volumeData.inputVolumeMul)
                      : 0
                  }
                />
              </div>
              <div className='deck-source-buttons'>
                {volumeCommitButton}
                {volumeRevertButton}
                <button onClick={() => toggleMute(inputName)}>
                  <FontAwesomeIcon
                    icon={inputs[inputName].volumeMuteData.inputMuted ? faVolumeMute : faVolumeHigh}
                  />
                </button>
              </div>
            </div>
          </div>,
        );
      }
    }
  }

  for (let g in groupLevel) {
    if (!groupLevel[g].enabled) {
      continue;
    }
    groupElements.push(
      <div className={'deck-volume-group ' + (groups[g].expanded ? 'expanded' : '')}>
        <div className='deck-volume-meter'>
          <div className='deck-volume-meter-label'>{truncate(g, 16)}</div>
          <div className='deck-volume-meter-ui'>
            <div
              className='deck-volume-meter-bars'
              key={g + '-' + groupLevel[g].l[1] + groupLevel[g].r[1]}
            >
              <VolumeMeter level={groupLevel[g].l} />
              <VolumeMeter level={groupLevel[g].r} />
            </div>
            <div className='deck-source-buttons'>
              <button onClick={() => expandGroup(g)}>
                <FontAwesomeIcon icon={groups[g].expanded ? faMinus : faPlus} />
              </button>
              <button onClick={() => toggleGroupMute(g)}>
                <FontAwesomeIcon icon={groups[g].groupMuted ? faVolumeMute : faVolumeHigh} />
              </button>
            </div>
          </div>
        </div>
        {groups[g].expanded ? groupItemElements[g] : null}
      </div>,
    );
  }

  return (
    <div className='deck-component deck-volume-control'>
      <label className='deck-component-label'>Volume</label>
      <div className='component-volume-controls'>
        {groupElements}
        {meterElements}
      </div>
    </div>
  );
}

const VolumeMeter = (rawLevel: KeyedObject) => {
  let scaleDim = window.innerWidth < 600 ? 'Y' : 'Y';
  let levels = {
    level: 0,
  };

  if (rawLevel.level) {
    levels.level = rawLevel.level[1];
  } else {
    levels = {
      level: 0,
    };
  }

  let levelStyle = {
    level: {
      clipPath: `polygon(${scaleDim == 'X' ? levels.level * 100 : 100}% ${scaleDim == 'Y' ? 100 - levels.level * 100 : 0}%, 0% ${scaleDim == 'Y' ? 100 - levels.level * 100 : 0}%, 0% 100%, ${scaleDim == 'X' ? levels.level * 100 : 100}% 100%)`,
    },
  };

  return (
    <div className='deck-volume-meter-bar'>
      <div className='deck-volume-meter-bar-peak'></div>
      <div className='deck-volume-meter-bar-level' style={levelStyle.level}></div>
      <div className='deck-volume-meter-bar-power'></div>
    </div>
  );
};

export { VolumeControl };
