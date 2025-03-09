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
} from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import useRecovery from '../../../../../app/hooks/useRecovery';
import FileDropZone from '../FileDropZone';
import RestorePluginSelection from '../selection/RestorePluginsSelection';
import RestoreSettingsSelection from '../selection/RestoreSettingsSelection';

export default function RestoreSettingsInput() {
  const {
    getSettingsBackups,
    getDeleteBackupSettings,
    getPrepareRestoreSettings,
    getRestoreSettings,
  } = useRecovery();
  const { data, isLoading, error } = getSettingsBackups();
  const { deleteBackupSettings } = getDeleteBackupSettings();
  const { prepareRestoreSettings } = getPrepareRestoreSettings();
  const { restoreSettings } = getRestoreSettings();
  const [selectedBackup, setSelectedBackup] = useState<string>('');
  const [backupFileNames, setBackupFileNames] = useState<string[]>([]);
  const [settingsFileSelection, setSettingsFileSelection] = useState<boolean>();

  if (isLoading) {
    return <FormLoader numRows={4} />;
  }

  const restoreSettingsOptions = data.map((pluginName: string) => ({
    label: pluginName,
    value: pluginName,
  }));

  restoreSettingsOptions.unshift({ label: 'Select Backup', value: '' });

  const handleFile = (file: File) => {
    prepareRestoreSettings(file.name, file);
  };

  if (settingsFileSelection) {
    return (
      <RestoreSettingsSelection
        backupName={selectedBackup}
        selections={backupFileNames}
        setSettingsFileSelection={setSettingsFileSelection}
      />
    );
  }

  return (
    <Stack spacing='medium'>
      <FileDropZone handleFile={handleFile} />
      <Box flexFlow='row wrap'>
        <SelectDropdown
          label='Select Backup'
          options={restoreSettingsOptions}
          onChange={(value) => setSelectedBackup(value)}
          value={restoreSettingsOptions.find((backupName: string) => {
            return backupName === selectedBackup;
          })}
        />
      </Box>
      <Button
        label='Restore Settings'
        onClick={() =>
          prepareRestoreSettings(selectedBackup).then((response) => {
            console.log(response.data, response.data.status);
            if (response.data.status === 'ok') {
              setBackupFileNames(response.data.data);
              setSettingsFileSelection(true);
            }
          })
        }
      />
    </Stack>
  );
}
