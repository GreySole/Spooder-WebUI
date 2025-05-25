import osc from 'osc-js';
import React, { useEffect } from 'react';
import VolumeController from './obs/volumeControl/VolumeController';
import SceneController from './obs/sceneController/SceneController';
import useOBS from '../../app/hooks/useOBS';
import OutputController from './obs/outputController/OutputController';
import SourceControl from './obs/sourceControl/SourceControl';
import ObsLogin from './obs/login/ObsLogin';
import { Box, CircleLoader, useOSC } from '@greysole/spooder-component-library';
import PageCircleLoader from '../common/input/general/PageCircleLoader';

export default function OBS() {
  const { isReady: isOSCReady } = useOSC();
  const { getObsSettings, getObsStatus, getConnectObsRemote, getDisconnectObsRemote } = useOBS();
  const { connectObsRemote } = getConnectObsRemote();
  const { disconnectObsRemote } = getDisconnectObsRemote();
  const { data: obsStatus, isLoading: statusLoading, error: statusError } = getObsStatus();
  const { data: obsData, isLoading: obsLoading, error: obsError } = getObsSettings();

  useEffect(() => {
    connectObsRemote();
    return () => {
      disconnectObsRemote();
    };
  }, []);

  if (obsLoading || statusLoading) {
    return <PageCircleLoader />;
  }

  console.log('IS OBS OSC READY', isOSCReady, obsStatus);

  if (isOSCReady && obsStatus.connected) {
    return (
      <Box flexFlow='column'>
        <OutputController />
        <SceneController />
        <SourceControl />
        <VolumeController />
      </Box>
    );
  } else {
    if (!isOSCReady) {
      return <h1>Hold on...we're connecting to OSC</h1>;
    } else if (!obsData.connected) {
      return (
        <ObsLogin obsConfig={obsData} />
      );
    }
  }
}
