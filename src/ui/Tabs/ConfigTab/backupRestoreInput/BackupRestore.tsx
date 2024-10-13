import React from 'react';
import { faUpload, faTrash, faDownload } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';
import BoolSwitch from '../../../common/input/controlled/BoolSwitch';
import BackupPluginsInput from './BackupPluginsInput';
import BackupSettingsInput from './BackupSettingsInput';
import RestoreSettingsInput from './RestoreSettingsInput';
import RestorePluginsInput from './RestorePluginsInput';

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
