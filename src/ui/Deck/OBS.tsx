import osc from 'osc-js';
import React from 'react';
import VolumeController from './obs/volumeControl/VolumeController';
import SceneController from './obs/sceneController/SceneController';
import useOBS from '../../app/hooks/useOBS';
import { useOSC } from '../../app/context/OscContext';
import LoadingCircle from '../common/LoadingCircle';
import OutputController from './obs/outputController/OutputController';
import SourceControl from './obs/sourceControl/SourceControl';
import ObsLogin from './obs/login/ObsLogin';

export default function OBS() {
  const { isReady: isOSCReady } = useOSC();
  const { getObsSettings, getObsStatus } = useOBS();
  const { data: obsStatus, isLoading: statusLoading, error: statusError } = getObsStatus();
  const { data: obsData, isLoading: obsLoading, error: obsError } = getObsSettings();

  if (obsLoading || statusLoading) {
    return <LoadingCircle />;
  }

  console.log('IS OBS OSC READY', isOSCReady, obsStatus);

  if (isOSCReady && obsStatus.connected) {
    return (
      <div className='App-content deck'>
        <OutputController />
        <SceneController />
        <SourceControl />
        <VolumeController />
      </div>
    );
  } else {
    if (!isOSCReady) {
      return <h1>Hold on...we're connecting to OSC</h1>;
    } else if (!obsData.connected) {
      return (
        <div className='App-content deck'>
          <h1 style={{ fontSize: '24px' }}>OBS not connected!</h1>
          <br></br>
          <p>
            OBS is connected by Spooder itself. So only one connect is needed for all your Web UI
            clients. Check 'Remember' to save this info on file and Spooder will automatically
            attempt to connect to OBS when starting up.
          </p>
          <ObsLogin obsConfig={obsData} />
        </div>
      );
    }
  }
}
