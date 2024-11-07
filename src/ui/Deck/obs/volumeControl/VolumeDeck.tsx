import React, { useCallback, useEffect, useState } from 'react';
import { KeyedObject } from '../../../Types';
import { useOSC } from '../../../../app/context/OscContext';
import VolumeControl from './VolumeControl';
import VolumeGroupControl from './VolumeGroupControl';
import { useObsWebsocketContext } from './VolumeContext';

export default function VolumeDeck() {
  const { groups, meters, meterNames, inputs, isReady } = useObsWebsocketContext();
  //console.log(meterNames);
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

  if (Object.keys(inputs).length == 0 || Object.keys(meterNames).length == 0) {
    return <div key={'' + isReady} className='deck-component deck-volume-control'></div>;
  }

  for (let m in meterNames) {
    if (!meterNames[m]) {
      continue;
    }
    let inputName: string = meterNames[m];

    for (let g in groups) {
      for (let s in groups[g].items) {
        if (groups[g].items[s].sourceName == inputName) {
          groupNames.push(inputName);

          groupLevel[g].enabled = true;
          groupItemElements[g].push(
            <VolumeControl key={g + '-' + meters[m].inputName} meterIndex={m} />,
          );

          if (meters[m].inputLevelsMul.length > 0) {
            if (meters[m].inputLevelsMul[0][1] > groupLevel[g].l[1]) {
              groupLevel[g].l = meters[m].inputLevelsMul[0];
            }
            if (meters[m].inputLevelsMul[1][1] > groupLevel[g].r[1]) {
              groupLevel[g].r = meters[m].inputLevelsMul[1];
            }
          }
        }
      }
    }
    if (!groupNames.includes(inputName)) {
      if (inputs[inputName] != null) {
        meterElements.push(<VolumeControl key={meterNames[m].inputName} meterIndex={m} />);
      }
    }
  }

  for (let g in groupLevel) {
    if (!groupLevel[g].enabled) {
      continue;
    }
    const groupSourceNames = groups[g].items.map((i: any) => i.sourceName);
    groupElements.push(
      <VolumeGroupControl
        key={g}
        groupName={g}
        groupMeterNames={groupSourceNames}
        groupLevelL={groupLevel[g].l[1]}
        groupLevelR={groupLevel[g].r[1]}
        groupMuted={groups[g].groupMuted}
      >
        {groupItemElements[g]}
      </VolumeGroupControl>,
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
