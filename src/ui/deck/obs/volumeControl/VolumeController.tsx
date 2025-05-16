import React from 'react';
import { ObsWebsocketProvider } from './VolumeContext';
import VolumeDeck from './VolumeDeck';

export default function VolumeController() {
  return (
    <ObsWebsocketProvider>
      <VolumeDeck />
    </ObsWebsocketProvider>
  );
}
