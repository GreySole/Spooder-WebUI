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
  LinkButton,
  ButtonRow,
} from '@greysole/spooder-component-library';
import { faDownload, faTrash } from '@fortawesome/free-solid-svg-icons';
import { StyleSize } from '../../../../Types';

export default function BackupPluginsInput() {
  const { getBackupPlugins, getPluginsBackups, getDeleteBackupPlugins } = useRecovery();
  const { deleteBackupPlugins, isLoading: deleteBackupPluginsLoading } = getDeleteBackupPlugins();
  const { data, isLoading, error, refetch } = getPluginsBackups();
  const { backupPlugins, isLoading: backupPluginsLoading } = getBackupPlugins();

  const [backupName, setBackupName] = useState<string>('');

  return (
    <Stack spacing='medium' padding='medium'>
      <Border>
        {isLoading || backupPluginsLoading || deleteBackupPluginsLoading ? (
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
                      link: '/recovery/checkout_plugins/' + backup,
                      linkName: backup.substring(0, backup.lastIndexOf('.')),
                    },
                    {
                      icon: faTrash,
                      onClick: () => {
                        deleteBackupPlugins(backup).then(() => {
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
            label={backupPluginsLoading ? 'Backing up...' : 'Backup Plugins Now'}
            disabled={backupPluginsLoading}
            onClick={() => {
              backupPlugins(backupName).then(() => {
                refetch();
              });
            }}
          />
        </Box>
      </Box>
    </Stack>
  );
}
