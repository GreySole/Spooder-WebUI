import React, { useState } from 'react';
import {
  useBackupPluginsMutation,
  useCheckInSettingsMutation,
} from '../../../../app/api/serverSlice';
import FileInput from '../../../Common/input/controlled/FileInput';
import TextInput from '../../../Common/input/controlled/TextInput';

export default function BackupSettingsInput() {
  const [
    backupSettings,
    {
      isLoading: backupSettingsLoading,
      isSuccess: backupSettingsSuccess,
      error: backupSettingsError,
    },
  ] = useBackupPluginsMutation();
  const [
    checkInSettings,
    {
      isLoading: checkInSettingsLoading,
      isSuccess: checkInSettingsSuccess,
      error: checkInSettingsError,
    },
  ] = useCheckInSettingsMutation();

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
        onClick={() => backupSettings(backupName)}
      >
        {backupSettingsLoading ? 'Backing up...' : 'Backup Settings Now'}
      </button>
      <FileInput label='Import' fileType='.zip' onChange={(files) => checkInSettings(files[0])} />
    </div>
  );
}
