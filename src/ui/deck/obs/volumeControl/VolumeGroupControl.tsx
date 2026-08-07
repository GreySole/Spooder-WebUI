import { faMinus, faPlus, faVolumeMute, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import React, { ReactNode, useState } from 'react';
import VolumeMeter from './VolumeMeter';
import {
  Border,
  Box,
  Button,
  Columns,
  Stack,
  StyleSizeButton,
  TypeFace,
  useOSC,
} from '@spooder/webui-component-library';
import GroupVolumeMeter from './GroupVolumeMeter';

interface VolumeGroupMeterProps {
  groupName: string;
  groupMeterNames: string[];
  groupLevelL: number;
  groupLevelR: number;
  groupMuted: boolean;
  children: React.JSX.Element[];
}

export default function VolumeGroupControl(props: VolumeGroupMeterProps) {
  const { groupName, groupLevelL, groupLevelR, groupMuted, children, groupMeterNames } = props;
  const { sendOSC } = useOSC();
  const [expanded, setExpanded] = useState(false);

  const toggleGroupMute = (isMuted: boolean) => {
    groupMeterNames.forEach((groupInputName) => {
      sendOSC(
        '/obs/set/input/mute',
        JSON.stringify({ inputName: groupInputName, inputMuted: isMuted }),
      );
    });
  };

  return (
    <Border>
      <Box height='inherit' flexFlow='row'>
        <Box width={StyleSizeButton.xlarge} height='100%' flexFlow='column' margin='small'>
          <TypeFace textAlign='center' whiteSpace='nowrap' textOverflow='ellipsis'>
            {groupName}
          </TypeFace>
          <Box flexFlow='row'>
            <Columns spacing='none'>
              <GroupVolumeMeter level={groupLevelL} muted={groupMuted} />
              <GroupVolumeMeter level={groupLevelR} muted={groupMuted} />
            </Columns>
            <Box flexFlow='column' justifyContent='flex-end' marginLeft='medium'>
              <Stack spacing='small'>
                <Button
                  icon={expanded ? faMinus : faPlus}
                  iconSize='large'
                  onClick={() => setExpanded(!expanded)}
                />
                <Button
                  icon={groupMuted ? faVolumeMute : faVolumeHigh}
                  iconSize='large'
                  onClick={() => toggleGroupMute(!groupMuted)}
                />
              </Stack>
            </Box>
          </Box>
        </Box>
        <Columns spacing='none'>{expanded ? children : null}</Columns>
      </Box>
    </Border>
  );
}
