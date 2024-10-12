import React, { useState } from 'react';
import {
  useBackupPluginsMutation,
  useCheckInPluginsMutation,
} from '../../../../app/api/serverSlice';
import FileInput from '../../../Common/input/controlled/FileInput';
import TextInput from '../../../Common/input/controlled/TextInput';

export default function BackupPluginsInput() {
  const [
    backupPlugins,
    {
      isLoading: backupSettingsLoading,
      isSuccess: backupSettingsSuccess,
      error: backupSettingsError,
    },
  ] = useBackupPluginsMutation();
  const [
    checkInPlugins,
    {
      isLoading: checkInPluginsLoading,
      isSuccess: checkInPluginsSuccess,
      error: checkInPluginsError,
    },
  ] = useCheckInPluginsMutation();

  const [backupName, setBackupName] = useState<string>('');

  return (
    <div>
      <TextInput
        label='Backup Name'
        placeholder='Default: Timestamp'
        value={backupName}
        onInput={(value) => setBackupName(value)}
      />
      <button
        type='button'
        className='link-button-button'
        onClick={() => backupPlugins(backupName)}
      >
        {backupSettingsLoading ? 'Backing up...' : 'Backup Settings Now'}
      </button>
      <FileInput label='Import' fileType='.zip' onChange={(files) => checkInPlugins(files[0])} />
    </div>
  );
}
