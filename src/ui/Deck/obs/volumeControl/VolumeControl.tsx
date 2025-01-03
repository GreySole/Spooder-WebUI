import {
  faCheck,
  faArrowCircleLeft,
  faVolumeMute,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import React, { useState } from 'react';
import { useOSC } from '../../../../app/context/OscContext';
import { useObsWebsocketContext } from './VolumeContext';
import { RangeInput, Button } from '@greysole/spooder-component-library';
import VolumeMeter from './VolumeMeter';

interface VolumeControlProps {
  meterIndex: string;
}

function truncate(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
}

export default function VolumeControl(props: VolumeControlProps) {
  const { meterIndex } = props;
  const { meters, inputs } = useObsWebsocketContext();

  if (meters[meterIndex] == undefined) {
    return null;
  }

  const inputName = meters[meterIndex].inputName;

  if (inputs[inputName] == undefined) {
    return null;
  }

  const channelL = meters[meterIndex].inputLevelsMul[0][1];
  const channelR = meters[meterIndex].inputLevelsMul[1][1];
  const volume = inputs[inputName].volumeData.inputVolumeMul;
  const muted = inputs[inputName].volumeMuteData.inputMuted;

  const [prevVolume, setPrevVolume] = useState(volume);
  const { sendOSC } = useOSC();
  const setVolume = (newVolume: number) => {
    sendOSC(
      '/obs/set/input/volume',
      JSON.stringify({ inputName: inputName, value: newVolume ** 2 }),
    );
  };
  const toggleMute = (isMuted: boolean) => {
    sendOSC('/obs/set/input/mute', JSON.stringify({ inputName: inputName, inputMuted: isMuted }));
  };
  const commitVolume = () => {
    setPrevVolume(volume);
  };
  const revertVolume = () => {
    sendOSC(
      '/obs/set/input/volume',
      JSON.stringify({
        inputName: inputName,
        value: prevVolume,
      }),
    );
    setVolume(prevVolume);
  };

  return (
    <div className='deck-volume-meter'>
      <div className='deck-volume-meter-label'>{truncate(inputName, 16)}</div>
      <div className='deck-volume-meter-ui'>
        <div className='deck-volume-meter-bars'>
          <VolumeMeter level={channelL} />
          <VolumeMeter level={channelR} />
        </div>
        <div className='deck-volume-control-slider'>
          <RangeInput
            onChange={(value) => setVolume(value)}
            min={0}
            max={1}
            step={0.01}
            value={Math.sqrt(volume)}
            vertical
          />
        </div>
        <div className='deck-source-buttons'>
          {volume != prevVolume ? (
            <Button label='' icon={faCheck} onClick={() => commitVolume()} />
          ) : null}
          {volume != prevVolume ? (
            <Button label='' icon={faArrowCircleLeft} onClick={() => revertVolume()} />
          ) : null}
          <Button
            label=''
            icon={muted ? faVolumeMute : faVolumeHigh}
            onClick={() => toggleMute(!muted)}
          />
        </div>
      </div>
    </div>
  );
}
