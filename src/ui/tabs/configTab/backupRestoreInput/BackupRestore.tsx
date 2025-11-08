import React, { useState } from 'react';
import BackupPluginsInput from './input/BackupPluginsInput';
import RestorePluginsInput from './input/RestorePluginsInput';
import { Box, Button, Columns, Stack, TypeFace } from '@greysole/spooder-component-library';
import BackupSettingsModal from './modal/BackupSettingsModal';
import RestoreSettingsModal from './modal/RestoreSettingsModal';
import BackupPluginsModal from './modal/BackupPluginsModal';
import RestorePluginsModal from './modal/RestorePluginsModal';
import AutoBackupModal from './modal/AutoBackupModal';

export default function BackupRestore() {
  const [backupSettingsOpen, setBackupSettingsOpen] = useState<boolean>(false);
  const [restoreSettingsOpen, setRestoreSettingsOpen] = useState<boolean>(false);
  const [backupPluginsOpen, setBackupPluginsOpen] = useState<boolean>(false);
  const [restorePluginsOpen, setRestorePluginsOpen] = useState<boolean>(false);
  const [autoBackupOpen, setAutoBackupOpen] = useState<boolean>(false);

  return (
    <>
      <AutoBackupModal isOpen={autoBackupOpen} setIsOpen={setAutoBackupOpen} />
      <BackupSettingsModal isOpen={backupSettingsOpen} setIsOpen={setBackupSettingsOpen} />
      <RestoreSettingsModal isOpen={restoreSettingsOpen} setIsOpen={setRestoreSettingsOpen} />
      <BackupPluginsModal isOpen={backupPluginsOpen} setIsOpen={setBackupPluginsOpen} />
      <RestorePluginsModal isOpen={restorePluginsOpen} setIsOpen={setRestorePluginsOpen} />
      <Stack spacing='large' padding='medium'>
        <Stack spacing='medium'>
          <TypeFace fontSize='large'>Auto Backup</TypeFace>
          <Columns spacing='medium'>
            <Button label=' Auto Backup Settings' onClick={() => setAutoBackupOpen(true)}></Button>
          </Columns>
        </Stack>
        <Stack spacing='medium'>
          <TypeFace fontSize='large'>Settings</TypeFace>
          <Columns spacing='medium'>
            <Button label='Backup Settings' onClick={() => setBackupSettingsOpen(true)}></Button>
            <Button label='Restore Settings' onClick={() => setRestoreSettingsOpen(true)}></Button>
          </Columns>
        </Stack>
        <Stack spacing='medium'>
          <TypeFace fontSize='large'>Plugins</TypeFace>
          <Columns spacing='medium'>
            <Button label='Backup Plugins' onClick={() => setBackupPluginsOpen(true)}></Button>
            <Button label='Restore Plugins' onClick={() => setRestorePluginsOpen(true)}></Button>
          </Columns>
        </Stack>
      </Stack>
    </>
  );
}
