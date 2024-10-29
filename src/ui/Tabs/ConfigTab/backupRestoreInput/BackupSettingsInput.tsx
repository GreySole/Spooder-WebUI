import React, { useState } from 'react';
import FileInput from '../../../common/input/controlled/FileInput';
import TextInput from '../../../common/input/controlled/TextInput';
import useRecovery from '../../../../app/hooks/useRecovery';

export default function BackupSettingsInput() {
  const { getBackupSettings, getCheckInSettings } = useRecovery();
  const { backupSettings, isLoading: backupSettingsLoading } = getBackupSettings();
  const { checkInSettings } = getCheckInSettings();

  const [backupName, setBackupName] = useState<string>('');

  return (
    <div>
      <TextInput
        label='Backup Name'
        placeholder='Default: Timestamp'
        value={backupName}
        onInput={(value) => setBackupName(value)}
      />
      <button type='button' className='link-button-button' onClick={() => backupSettings()}>
        {backupSettingsLoading ? 'Backing up...' : 'Backup Settings Now'}
      </button>
      <FileInput label='Import' fileType='.zip' onChange={(files) => checkInSettings(files[0])} />
    </div>
  );
}
