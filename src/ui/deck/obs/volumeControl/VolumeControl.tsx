import {
  faCheck,
  faArrowCircleLeft,
  faVolumeMute,
  faVolumeHigh,
} from '@fortawesome/free-solid-svg-icons';
import React, { useEffect, useState } from 'react';
import { useObsWebsocketContext } from './VolumeContext';
import {
  Button,
  useOSC,
  Stack,
  Box,
  Columns,
  TypeFace,
  useTheme,
  StyleSizeButton,
  Slider,
} from '@spooder/webui-component-library';
import VolumeMeter from './VolumeMeter';

interface VolumeControlProps {
  inputName: string;
  meterIndex: string;
}

export default function VolumeControl(props: VolumeControlProps) {
  const { inputName, meterIndex } = props;
  const { inputs } = useObsWebsocketContext();
  const { themeColors } = useTheme();

  if (!inputs[inputName]) {
    return null;
  }

  const volume = inputs[inputName].volumeData.inputVolumeMul;
  const dbLevel = inputs[inputName].volumeData.inputVolumeDb;
  const muted = inputs[inputName].volumeMuteData.inputMuted;

  const [prevVolume, setPrevVolume] = useState(0);
  const { sendOSC } = useOSC();

  useEffect(() => {
    setPrevVolume(volume);
  }, []);

  const setVolume = (newVolume: number) => {
    console.log('NEW VOLUME', newVolume);
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
  };

  return (
    <Box width={StyleSizeButton.xlarge} height='100%' flexFlow='column' margin='small'>
      <TypeFace textAlign='center' whiteSpace='nowrap' textOverflow='ellipsis'>
        {inputName}
      </TypeFace>
      <TypeFace textAlign='center' whiteSpace='nowrap' textOverflow='ellipsis'>
        {dbLevel.toFixed(2)} dB
      </TypeFace>
      <Box flexFlow='row'>
        <Columns spacing='none'>
          <VolumeMeter channel='l' meterIndex={meterIndex} muted={muted} />
          <VolumeMeter channel='r' meterIndex={meterIndex} muted={muted} />
        </Columns>
        <Box height='100%' justifyContent='flex-end' marginLeft='medium' paddingTop='medium'>
          <Slider
            orientation='vertical'
            gradient={`${themeColors.buttonBackgroundColor},${themeColors.backgroundColorFar}`}
            value={Math.sqrt(volume)}
            step={0.01}
            onChange={(value: number) => setVolume(value)}
          />
        </Box>
        <Box flexFlow='column' justifyContent='flex-end' marginLeft='medium'>
          <Stack spacing='small'>
            {volume != prevVolume ? (
              <Button icon={faCheck} iconSize='large' onClick={() => commitVolume()} />
            ) : null}
            {volume != prevVolume ? (
              <Button icon={faArrowCircleLeft} iconSize='large' onClick={() => revertVolume()} />
            ) : null}
            <Button
              icon={muted ? faVolumeMute : faVolumeHigh}
              iconSize='large'
              onClick={() => toggleMute(!muted)}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
