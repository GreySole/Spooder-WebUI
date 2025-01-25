import React from 'react';
import BackupPluginsInput from './BackupPluginsInput';
import BackupSettingsInput from './BackupSettingsInput';
import RestorePluginsInput from './RestorePluginsInput';
import RestoreSettingsInput from './RestoreSettingsInput';

export default function BackupRestore() {
  return (
    <div className='config-backup-restore'>
      <div className='backup-actions'>
        <label className='backup-section-label'>Backup</label>
        <div className='backup-action-button'>
          <label>Settings</label>
          <BackupSettingsInput />
        </div>
        <div className='backup-action-button'>
          <label>Plugins</label>
          <BackupPluginsInput />
        </div>
      </div>
      <div className='restore-actions'>
        <label className='restore-section-label'>Restore</label>
        <RestoreSettingsInput />
        <RestorePluginsInput />
      </div>
    </div>
  );
}
