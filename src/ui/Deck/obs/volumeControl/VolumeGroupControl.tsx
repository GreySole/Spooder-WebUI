import { faMinus, faPlus, faVolumeMute, faVolumeHigh } from '@fortawesome/free-solid-svg-icons';
import React, { ReactNode, useState } from 'react';
import VolumeMeter from './VolumeMeter';
import { useOSC } from '../../../../app/context/OscContext';
import { Button } from '@greysole/spooder-component-library';

interface VolumeGroupMeterProps {
  groupName: string;
  groupMeterNames: string[];
  groupLevelL: number;
  groupLevelR: number;
  groupMuted: boolean;
  children: React.JSX.Element[];
}

function truncate(str: string, n: number) {
  return str.length > n ? str.substr(0, n - 1) + '...' : str;
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
    <div className={'deck-volume-group ' + (expanded ? 'expanded' : '')}>
      <div className='deck-volume-meter'>
        <div className='deck-volume-meter-label'>{truncate(groupName, 16)}</div>
        <div className='deck-volume-meter-ui'>
          <div className='deck-volume-meter-bars'>
            <VolumeMeter level={groupLevelL} />
            <VolumeMeter level={groupLevelR} />
          </div>
          <div className='deck-source-buttons'>
            <Button
              label=''
              icon={expanded ? faMinus : faPlus}
              onClick={() => setExpanded(!expanded)}
            />
            <Button
              label=''
              icon={groupMuted ? faVolumeMute : faVolumeHigh}
              onClick={() => toggleGroupMute(!groupMuted)}
            />
          </div>
        </div>
      </div>
      {expanded ? children : null}
    </div>
  );
}
