import React, { useState } from 'react';
import useRecovery from '../../../../app/hooks/useRecovery';
import { TextInput, FileInput } from '@greysole/spooder-component-library';

export default function BackupPluginsInput() {
  const { getBackupPlugins, getCheckInPlugins } = useRecovery();
  const { backupPlugins, isLoading: backupPluginsLoading } = getBackupPlugins();
  const { checkInPlugins } = getCheckInPlugins();

  const [backupName, setBackupName] = useState<string>('');

  return (
    <div>
      <TextInput
        label='Backup Name'
        placeholder='Default: Timestamp'
        value={backupName}
        onInput={(value) => setBackupName(value)}
      />
      <button type='button' className='link-button-button' onClick={() => backupPlugins()}>
        {backupPluginsLoading ? 'Backing up...' : 'Backup Settings Now'}
      </button>
      <FileInput label='Import' fileType='zip' onChange={(files) => checkInPlugins(files[0])} />
    </div>
  );
}
