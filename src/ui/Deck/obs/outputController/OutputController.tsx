import React, { useEffect, useState } from 'react';
import OSC from 'osc-js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle, faStream, faCog, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { useOSC } from '../../../../app/context/OscContext';
import { FormBoolSwitch } from '@greysole/spooder-component-library';

export default function OutputController() {
  const { addListener, removeListener, sendOSC } = useOSC();
  const [streamStatus, setStreamStatus] = useState({
    outputActive: false,
    outputReconnecting: false,
    outputBytes: 0,
    outputTimecode: 0,
    outputSkippedFrames: 0,
    outputTotalFrames: 0,
  });
  const [recordStatus, setRecordStatus] = useState({
    outputActive: false,
    outputPaused: false,
    outputTimecode: 0,
    outputBytes: 0,
  });
  const [settings, setSettings] = useState({
    recordRename: false,
    frameDropAlert: false,
    disconnectAlert: false,
  });
  const [isReady, setIsReady] = useState<Boolean>(false);
  const [settingsOpen, setSettingsOpen] = useState<Boolean>(false);

  useEffect(() => {
    addListener('/obs/get/status', getStatus);
    addListener('/obs/event/RecordStateChanged', recordStateChanged);
    addListener('/obs/event/StreamStateChanged', streamStateChanged);
    addListener('/obs/status/interval', activateInterval);

    return () => {
      removeListener('/obs/get/status');
      removeListener('/obs/event/RecordStateChanged');
      removeListener('/obs/event/StreamStateChanged');
      removeListener('/obs/status/interval');
    };
  }, []);

  function getSettings() {
    fetch('/obs/get_output_settings')
      .then((response) => response.json())
      .then((data) => {
        let newSettings = Object.assign(settings, data);
        setSettings(newSettings);
      });
  }

  function saveSettings() {
    fetch('/obs/save_output_settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(Object.assign({}, settings)),
    })
      .then((response) => response.json())
      .then((data) => {
        closeSettings();
      });
  }

  function activateInterval() {
    sendOSC('/obs/status/interval', 1);
  }

  function getStatus(data: any) {
    let statusData = JSON.parse(data.args[0]);
    if (statusData.stream.outputActive == true || statusData.record.outputActive == true) {
      sendOSC('/obs/status/interval', 1);
    }
    setStreamStatus(statusData.stream);
    setRecordStatus(statusData.record);
  }

  function toggleStream() {
    sendOSC('/obs/stream', 'toggle');
    if (streamStatus.outputActive == false) {
      sendOSC('/obs/status/interval', 1);
    }
  }

  function toggleRecord() {
    sendOSC('/obs/record', 'toggle');
    if (recordStatus.outputActive == false) {
      sendOSC('/obs/status/interval', 1);
    }
  }

  function toggleRecordPause() {
    sendOSC('/obs/record', recordStatus.outputPaused ? 'resume' : 'pause');
  }

  function streamStateChanged(data: any) {
    let streamObj = JSON.parse(data.args[0]);
    let newStreamStatus = Object.assign(streamStatus);
    newStreamStatus.outputActive = streamObj.outputActive;

    setStreamStatus(newStreamStatus);
  }

  function recordStateChanged(data: any) {
    let recordObj = JSON.parse(data.args[0]);
    let newRecordStatus = Object.assign(recordStatus);
    newRecordStatus.outputActive = recordObj.outputActive;

    setRecordStatus(newRecordStatus);
  }

  function convertBytes(bytes: number) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i)) + ' ' + sizes[i];
  }

  function openSettings() {
    setSettingsOpen(true);
  }

  function closeSettings() {
    getSettings();
    setSettingsOpen(false);
  }

  function onSettingChange(e: any) {
    let newSettings: any = Object.assign({}, settings);
    newSettings[e.target.name] = e.target.checked;
    setSettings(newSettings);
  }

  const streamStatusEl = (
    <div className='output-controller-stream-status'>
      <h2>{streamStatus.outputTimecode}</h2>
      <h2>
        Skipped: {streamStatus.outputSkippedFrames} (
        {Math.floor((streamStatus.outputSkippedFrames / streamStatus.outputTotalFrames) * 100)}
        %)
      </h2>
      <h2>Out Data: {convertBytes(streamStatus.outputBytes)}</h2>
    </div>
  );

  const recordStatusEl = (
    <div className='output-controller-record-status'>
      <h2>{recordStatus.outputTimecode}</h2>
      <h2>Out Data: {convertBytes(recordStatus.outputBytes)}</h2>
    </div>
  );

  let recordPauseButton = (
    <div onClick={toggleRecordPause} className={'output-controller-button'}>
      <label>Pause</label>
      <FontAwesomeIcon icon={recordStatus.outputPaused ? faPlay : faPause} size='2x' />
    </div>
  );

  if (settingsOpen) {
    return (
      <div className='deck-component deck-output-controller'>
        <div className='output-settings-container'>
          <FormBoolSwitch
            label='Set recording file to stream name (excludes special characters and takes the left side of |'
            formKey={''}
          />
          <FormBoolSwitch label='Alert chat on consistant frame drops and recovery' formKey={''} />
          <FormBoolSwitch label='Alert chat on disconnection and recovery' formKey={''} />
          <button className='save-button' onClick={saveSettings}>
            Save
          </button>
          <button className='delete-button' onClick={closeSettings}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='deck-component deck-output-controller'>
      <label className='deck-component-label'>Output</label>
      <div className='output-controller-buttons'>
        <div className='output-controller-stream'>
          <div
            onClick={toggleStream}
            className={
              'output-controller-button ' +
              (streamStatus.outputActive ? 'streaming ' : '') +
              (streamStatus.outputReconnecting ? 'reconnecting' : '')
            }
          >
            <label>Stream</label>
            <FontAwesomeIcon icon={faStream} size='2x' />
          </div>
          {streamStatusEl}
        </div>
        <div className='output-controller-record'>
          <div className='controller-record-buttons'>
            <div
              onClick={toggleRecord}
              className={
                'output-controller-button ' +
                (recordStatus.outputActive ? 'recording ' : '') +
                (recordStatus.outputPaused ? 'paused' : '')
              }
            >
              <label>Record</label>
              <FontAwesomeIcon icon={faCircle} size='2x' />
            </div>
            {recordStatus.outputActive || recordStatus.outputPaused ? recordPauseButton : null}
          </div>
          {recordStatusEl}
        </div>
        <div className='output-controller-settings'>
          <div onClick={settingsOpen} className={'output-controller-button'}>
            <label>Settings</label>
            <FontAwesomeIcon icon={faCog} size='2x' />
          </div>
        </div>
      </div>
    </div>
  );
}
