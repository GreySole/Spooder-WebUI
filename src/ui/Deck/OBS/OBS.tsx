import osc from 'osc-js';
import React from 'react';
import VolumeControl from './VolumeControl';
import OutputController from './OutputController';
import SceneController from './SceneController';
import SourceControl from './SourceControl';
import useOBS from '../../../app/hooks/useOBS';
import { useOSC } from '../../../app/context/OscContext';

export default function OBS() {
  const { isReady: isOSCReady } = useOSC();
  const { getObsSettings } = useOBS();
  const { data: obsData, isLoading: obsLoading, error: obsError } = getObsSettings();

  if (isOSCReady && obsData.connected) {
    return (
      <div className='App-content deck'>
        <OutputController />
        <SceneController />
        <SourceControl />
        <VolumeControl />
      </div>
    );
  } else {
    if (!isOSCReady) {
      return <h1>Hold on...we're connecting to OSC</h1>;
    } else if (!obsData.connected) {
      const obsLoginEl = (
        <div className='obs-login-info'>
          <label>
            IP Address
            <input name='url' type='text' />
          </label>
          <label>
            Port
            <input name='port' type='text' />
          </label>
          <label>
            Password
            <input name='password' type='password' />
          </label>
          <label>
            Remember
            <input name='remember' type='checkbox' />
          </label>
          <button type='button' className='save-button'>
            Connect
          </button>
        </div>
      );

      return (
        <div className='App-content deck'>
          <h1 style={{ fontSize: '24px' }}>OBS not connected!</h1>
          <br></br>
          <p>
            OBS is connected by Spooder itself. So only one connect is needed for all your Web UI
            clients. Check 'Remember' to save this info on file and Spooder will automatically
            attempt to connect to OBS when starting up.
          </p>
          {obsLoginEl}
        </div>
      );
    }
  }
}
