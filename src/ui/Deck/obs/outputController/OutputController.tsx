import React, { useEffect, useState } from 'react';
import { faCircle, faStream, faCog, faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import {
  Border,
  Box,
  Button,
  FormBoolSwitch,
  Stack,
  TypeFace,
  useOSC,
  useTheme,
} from '@greysole/spooder-component-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [settingsOpen, setSettingsOpen] = useState<Boolean>(false);
  const { isMobileDevice } = useTheme();

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

  function closeSettings() {
    getSettings();
    setSettingsOpen(false);
  }

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

  console.log('OUTPUT CONTROLLER', streamStatus, recordStatus);

  return (
    <Border borderBottom>
      <Stack spacing='small' padding='medium'>
        <Box flexFlow='row' justifyContent='space-around' alignItems='center'>
          <Box flexFlow={isMobileDevice ? 'column' : 'row'} alignItems='center'>
            <Button
              className={
                'output-controller-button ' +
                (streamStatus.outputActive ? 'streaming ' : '') +
                (streamStatus.outputReconnecting ? 'reconnecting' : '')
              }
              label='Stream'
              icon={faStream}
              iconPosition='bottom'
              iconGap='small'
              onClick={toggleStream}
            />
            <Box flexFlow='column' marginLeft='small'>
              <TypeFace>{streamStatus.outputTimecode}</TypeFace>
              <TypeFace>
                Skipped: {streamStatus.outputSkippedFrames} (
                {Math.floor(
                  (streamStatus.outputSkippedFrames / streamStatus.outputTotalFrames) * 100,
                )}
                %)
              </TypeFace>
              <TypeFace>Out Data: {convertBytes(streamStatus.outputBytes)}</TypeFace>
            </Box>
          </Box>
          <Box flexFlow={isMobileDevice ? 'column' : 'row'} alignItems='center'>
            <Button
              className={
                'output-controller-button ' +
                (recordStatus.outputActive ? 'recording ' : '') +
                (recordStatus.outputPaused ? 'paused' : '')
              }
              label='Record'
              icon={faCircle}
              iconPosition='bottom'
              iconGap='small'
              onClick={toggleRecord}
            />
            {recordStatus.outputActive || recordStatus.outputPaused ? (
              <Button
                className={'output-controller-button '}
                label='Pause'
                icon={recordStatus.outputPaused ? faPlay : faPause}
                iconPosition='bottom'
                iconGap='small'
                onClick={toggleRecordPause}
              />
            ) : null}
            <Box flexFlow='column' marginLeft='small'>
              <TypeFace>{recordStatus.outputTimecode}</TypeFace>
              <TypeFace>Out Data: {convertBytes(recordStatus.outputBytes)}</TypeFace>
              <TypeFace>Empty Space</TypeFace>
            </Box>
          </Box>
        </Box>
      </Stack>
    </Border>
  );
}
