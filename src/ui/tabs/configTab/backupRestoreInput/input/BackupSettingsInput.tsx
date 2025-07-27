import React, { useState } from 'react';
import useRecovery from '../../../../../app/hooks/useRecovery';
import {
  TextInput,
  FileInput,
  Button,
  Stack,
  TypeFace,
  Border,
  Box,
  FormLoader,
  ButtonRow,
} from '@greysole/spooder-component-library';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function BackupSettingsInput() {
  const { getBackupSettings, getSettingsBackups, getDeleteBackupSettings } = useRecovery();
  const { backupSettings, isLoading: backupSettingsLoading } = getBackupSettings();
  const { deleteBackupSettings, isLoading: deleteBackupSettingsLoading } =
    getDeleteBackupSettings();
  const { data, isLoading, error, refetch } = getSettingsBackups();

  const [backupName, setBackupName] = useState<string>('');

  return (
    <Stack spacing='medium' padding='medium'>
      <Border>
        {isLoading || backupSettingsLoading || deleteBackupSettingsLoading ? (
          <FormLoader />
        ) : (
          <Stack spacing='small' padding='medium'>
            <TypeFace fontSize='large'>Backup List</TypeFace>
            {data?.map((backup: string) => (
              <Box key={backup} flexFlow='row' justifyContent='space-between' alignItems='center'>
                <TypeFace userSelect='none'>{backup}</TypeFace>
                <ButtonRow
                  buttonSize='large'
                  iconSize='large'
                  buttons={[
                    {
                      icon: faDownload,
                      isLink: true,
                      link: '/recovery/checkout_settings/' + backup,
                      linkName: backup.substring(0, backup.lastIndexOf('.')),
                    },
                    {
                      icon: faTrash,
                      onClick: () => {
                        deleteBackupSettings(backup).then(() => {
                          refetch();
                        });
                      },
                    },
                  ]}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Border>
      <Box flexFlow='row wrap'>
        <TextInput
          label='Backup Name'
          placeholder='Default: Timestamp'
          value={backupName}
          onInput={(value) => setBackupName(value)}
        />
        <Box padding='small'>
          <Button
            label={backupSettingsLoading ? 'Backing up...' : 'Backup Settings Now'}
            disabled={backupSettingsLoading}
            onClick={() => {
              backupSettings(backupName).then(() => {
                refetch();
              });
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
