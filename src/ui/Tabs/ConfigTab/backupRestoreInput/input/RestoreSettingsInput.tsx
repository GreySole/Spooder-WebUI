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
  FileDropZone,
} from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import useRecovery from '../../../../../app/hooks/useRecovery';
import RestoreSettingsSelection from '../selection/RestoreSettingsSelection';

export default function RestoreSettingsInput() {
  const { getSettingsBackups, getPrepareRestoreSettings } = useRecovery();
  const { data, isLoading, error } = getSettingsBackups();
  const { prepareRestoreSettings } = getPrepareRestoreSettings();
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
    prepareRestoreSettings(file.name, file).then((response) => {
      console.log(response.data, response.data.status);
      if (response.data.status === 'ok') {
        setBackupFileNames(response.data.data);
        setSettingsFileSelection(true);
      }
    });
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
      <FileDropZone width='100%' height='25vh' handleFile={handleFile} />
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
