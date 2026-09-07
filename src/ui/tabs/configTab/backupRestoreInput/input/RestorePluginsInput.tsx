import { faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import {
  FormLoader,
  BoolSwitch,
  SelectDropdown,
  Button,
  LinkButton,
  TypeFace,
  Stack,
  Box,
  useOSC,
  CircleLoader,
  FileDropZone,
} from '@spooder/webui-component-library';
import React, { useEffect, useState } from 'react';
import useRecovery from '../../../../../app/hooks/useRecovery';
import RestorePluginSelection from '../selection/RestorePluginsSelection';
import { KeyedObject } from '../../../../Types';
import PageCircleLoader from '../../../../common/input/general/PageCircleLoader';
import ProgressBar from '../../../../common/input/general/ProgressBar';

interface OSCProgressObject {
  name: string;
  message: string;
  progress: number;
  totalProgress: number;
}

export default function RestorePluginsInput() {
  const { getPluginsBackups, getPrepareRestorePlugins, getRestorePlugins } = useRecovery();
  const { data, isLoading, error } = getPluginsBackups();
  const { prepareRestorePlugins } = getPrepareRestorePlugins();
  const { restorePlugins } = getRestorePlugins();
  const [selectedBackup, setSelectedBackup] = useState<string>('');
  const [backupPluginList, setBackupPluginList] = useState<KeyedObject[]>([]);
  const [PluginsFileSelection, setPluginsFileSelection] = useState<boolean>();
  const { addListener, removeListener, isReady } = useOSC();
  const [isRestoring, setIsRestoring] = useState<boolean>(false);
  const [isUnpacking, setIsUnpacking] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [currentProgressObj, setCurrentProgressObj] = useState<OSCProgressObject>({
    name: '',
    message: 'Starting Restore...',
    progress: 0,
    totalProgress: 0,
  });

  useEffect(() => {
    console.log('PLUGIN INPUT EFFECT RENDER');
    addListener('/spooder/restore/plugin', (data: any) => {
      const jsonData = JSON.parse(data.args[0]);
      setCurrentProgressObj(jsonData);
    });

    return () => {
      removeListener('/spooder/restore/plugin');
    };
  }, []);

  if (isLoading) {
    return <FormLoader numRows={4} />;
  }

  if (uploadProgress !== null) {
    return (
      <Box flexFlow='column' alignItems='center' width='100%' height='100%'>
        <Stack spacing='medium'>
          <TypeFace fontSize='large'>Uploading Backup...</TypeFace>
          <Box width='300px'>
            <ProgressBar progress={uploadProgress} total={100} />
          </Box>
          <TypeFace fontSize='medium'>{uploadProgress}%</TypeFace>
        </Stack>
      </Box>
    );
  }

  if (isUnpacking) {
    return (
      <Box flexFlow='column' alignItems='center' width='100%' height='100%'>
        <Stack spacing='medium'>
          <PageCircleLoader />
          <TypeFace fontSize='large'>
            {currentProgressObj.totalProgress > 0
              ? currentProgressObj.message
              : 'Unpacking Backup. This can take a while...'}
          </TypeFace>
          {currentProgressObj.totalProgress > 0 && (
            <>
              <Box width='300px'>
                <ProgressBar
                  progress={currentProgressObj.progress}
                  total={currentProgressObj.totalProgress}
                />
              </Box>
              <TypeFace fontSize='medium'>
                {currentProgressObj.progress} / {currentProgressObj.totalProgress}
              </TypeFace>
            </>
          )}
        </Stack>
      </Box>
    );
  }

  const restorePluginsOptions = data.map((pluginName: string) => ({
    label: pluginName,
    value: pluginName,
  }));

  restorePluginsOptions.unshift({ label: 'Select Backup', value: '' });

  const handleFile = (files: FileList) => {
    const file = files[0];
    setCurrentProgressObj({ name: '', message: 'Starting Restore...', progress: 0, totalProgress: 0 });
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('backupName', file.name);
    formData.append('file', file);

    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (event) => {
      if (event.lengthComputable) {
        setUploadProgress(Math.round((event.loaded / event.total) * 100));
      }
    });

    xhr.upload.addEventListener('load', () => {
      setUploadProgress(null);
      setIsUnpacking(true);
    });

    xhr.addEventListener('load', () => {
      setIsUnpacking(false);
      try {
        const response = JSON.parse(xhr.responseText);
        if (response.status === 'ok') {
          setBackupPluginList(response.data);
          setPluginsFileSelection(true);
        }
      } catch (e) {
        console.error('Failed to parse restore response', e);
      }
    });

    xhr.addEventListener('error', () => {
      setUploadProgress(null);
      setIsUnpacking(false);
    });

    xhr.open('POST', window.location.origin + '/recovery/prepare_restore_plugins');
    xhr.send(formData);
  };

  if (isRestoring) {
    return (
      <Box width='100%' height='100%' justifyContent='center' alignItems='center'>
        <Stack spacing='medium'>
          <PageCircleLoader />
          <TypeFace fontSize='large'>{currentProgressObj?.message}</TypeFace>
          <Box width='300px'>
            <ProgressBar
              progress={currentProgressObj?.progress ?? 0}
              total={currentProgressObj?.totalProgress ?? 0}
            />
          </Box>
          <TypeFace fontSize='large'>
            {currentProgressObj?.progress} / {currentProgressObj?.totalProgress}
          </TypeFace>
        </Stack>
      </Box>
    );
  }

  const startRestoring = (backupName: string, selections: any) => {
    setCurrentProgressObj({ name: '', message: 'Starting Restore...', progress: 0, totalProgress: 0 });
    restorePlugins(backupName, selections).then((response) => {
      setIsRestoring(false);
    });
    setPluginsFileSelection(false);
    setIsRestoring(true);
  };

  if (PluginsFileSelection) {
    return (
      <RestorePluginSelection
        backupName={selectedBackup}
        pluginList={backupPluginList}
        goBack={() => setPluginsFileSelection(false)}
        startRestoring={startRestoring}
      />
    );
  }

  return (
    <Stack spacing='medium'>
      <FileDropZone
        width='100%'
        height='25vh'
        handleFile={handleFile}
        acceptedFileTypes={['.zip']}
      />
      <Box flexFlow='row wrap'>
        <SelectDropdown
          label='Select Backup'
          options={restorePluginsOptions}
          onChange={(value) => setSelectedBackup(value)}
          value={restorePluginsOptions.find((backupName: string) => {
            return backupName === selectedBackup;
          })}
        />
      </Box>
      <Button
        label='Restore Plugins'
        disabled={!selectedBackup}
        onClick={() => {
          setCurrentProgressObj({
            name: '',
            message: 'Starting Restore...',
            progress: 0,
            totalProgress: 0,
          });
          setIsUnpacking(true);
          prepareRestorePlugins(selectedBackup).then((response) => {
            console.log(response.data, response.data.status);
            if (response.data.status === 'ok') {
              setIsUnpacking(false);
              setBackupPluginList(response.data.data);
              setPluginsFileSelection(true);
            }
          });
        }}
      />
    </Stack>
  );
}
