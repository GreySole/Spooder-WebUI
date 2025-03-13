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
} from '@greysole/spooder-component-library';
import React, { useEffect, useState } from 'react';
import useRecovery from '../../../../../app/hooks/useRecovery';
import RestorePluginSelection from '../selection/RestorePluginsSelection';
import { KeyedObject } from '../../../../Types';

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
  const [currentProgressObj, setCurrentProgressObj] = useState<OSCProgressObject>({
    name: '',
    message: 'Starting Restore...',
    progress: 0,
    totalProgress: 0,
  });

  useEffect(() => {
    console.log('PLUGIN INPUT EFFECT RENDER');
    addListener('/spooder/restore/plugin', (data) => {
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

  if (isUnpacking) {
    return (
      <Box flexFlow='column' alignItems='center' width='100%' height='100%'>
        <Stack spacing='medium'>
          <CircleLoader />
          <TypeFace fontSize='large'>Unpacking Backup. This can take a while...</TypeFace>
        </Stack>
      </Box>
    );
  }

  const restorePluginsOptions = data.map((pluginName: string) => ({
    label: pluginName,
    value: pluginName,
  }));

  restorePluginsOptions.unshift({ label: 'Select Backup', value: '' });

  const handleFile = (file: File) => {
    setIsUnpacking(true);
    prepareRestorePlugins(file.name, file).then((response) => {
      console.log(response.data, response.data.status);
      if (response.data.status === 'ok') {
        setIsUnpacking(false);
        setBackupPluginList(response.data.data);
        setPluginsFileSelection(true);
      }
    });
  };

  if (isRestoring) {
    return (
      <Box width='100%' height='100%' justifyContent='center' alignItems='center'>
        <Stack spacing='medium'>
          <CircleLoader />
          <TypeFace fontSize='large'>{currentProgressObj?.message}</TypeFace>
          <TypeFace fontSize='large'>
            {currentProgressObj?.progress} / {currentProgressObj?.totalProgress}
          </TypeFace>
        </Stack>
      </Box>
    );
  }

  const startRestoring = (backupName: string, selections: any) => {
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
