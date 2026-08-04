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
} from '@spooder/webui-component-library';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useOBS from '../../../../app/hooks/useOBS';
import { get } from 'react-hook-form';

export default function OutputController() {
  const { addListener, removeListener, sendOSC } = useOSC();
  const { getObsControlApi, getObsFetchApi } = useOBS();
  const {
    getStartStream,
    getStopStream,
    getStartRecord,
    getStopRecord,
    getPauseRecord,
    getResumeRecord,
  } = getObsControlApi();
  const { getStreamStatusQuery, getRecordStatusQuery } = getObsFetchApi();
  const { startStream } = getStartStream();
  const { stopStream } = getStopStream();
  const { startRecord } = getStartRecord();
  const { stopRecord } = getStopRecord();
  const { pauseRecord } = getPauseRecord();
  const { resumeRecord } = getResumeRecord();

  const [settings, setSettings] = useState({
    recordRename: false,
    frameDropAlert: false,
    disconnectAlert: false,
  });
  const [settingsOpen, setSettingsOpen] = useState<Boolean>(false);
  const { isMobileDevice } = useTheme();
  const [outputInterval, setOutputInterval] = useState<any>();

  const {
    data: streamStatus,
    isLoading: streamLoading,
    refetch: refetchStream,
  } = getStreamStatusQuery();
  const {
    data: recordStatus,
    isLoading: recordLoading,
    refetch: refetchRecord,
  } = getRecordStatusQuery();

  useEffect(() => {
    addListener('/obs/event/RecordStateChanged', recordStateChanged);
    addListener('/obs/event/StreamStateChanged', streamStateChanged);

    return () => {
      removeListener('/obs/event/RecordStateChanged');
      removeListener('/obs/event/StreamStateChanged');
    };
  }, []);

  useEffect(() => {
    if (!streamStatus || !recordStatus) {
      return;
    }
    console.log('Output interval', outputInterval, streamStatus);
    if (!outputInterval && (streamStatus.outputActive || recordStatus.outputActive)) {
      setOutputInterval(
        setInterval(() => {
          refetchStream();
          refetchRecord();
        }, 1000),
      );
    } else if (outputInterval && !streamStatus.outputActive && !recordStatus.outputActive) {
      clearInterval(outputInterval);
      setOutputInterval(null);
    }
  }, [streamStatus, recordStatus]);

  if (streamLoading || recordLoading) {
    return null;
  }

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

  function toggleStream() {
    if (streamStatus.outputActive) {
      stopStream();
    } else {
      startStream();
    }
  }

  function toggleRecord() {
    if (recordStatus.outputActive) {
      stopRecord();
    } else {
      startRecord();
    }
  }

  function toggleRecordPause() {
    if (recordStatus.outputPaused) {
      resumeRecord();
    } else {
      pauseRecord();
    }
  }

  function streamStateChanged(data: any) {
    refetchStream();
  }

  function recordStateChanged(data: any) {
    refetchRecord();
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
