import {
  Expandable,
  FormBoolSwitch,
  FormSelectDropdown,
  SelectDropdown,
  Stack,
} from '@spooder/webui-component-library';
import React, { useState, useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import AutoBackupScheduleSet from './autoBackup/AutoBackupScheduleSet';

export default function AutoBackupSection() {
  const baseFormKey = 'backup';
  const { watch } = useFormContext();
  const autoBackupSettingsEnabled = watch(`${baseFormKey}.auto_backup.settings.enabled`);
  const autoBackupPluginsEnabled = watch(`${baseFormKey}.auto_backup.plugins.enabled`);

  return (
    <Expandable label='Auto Backup'>
      <Stack spacing='medium' padding='medium'>
        <FormBoolSwitch
          formKey={`${baseFormKey}.auto_backup.settings.enabled`}
          label='Enable Settings Auto Backup'
        />
        {autoBackupSettingsEnabled && (
          <AutoBackupScheduleSet formKey={`${baseFormKey}.auto_backup.settings`} />
        )}
        <FormBoolSwitch
          formKey={`${baseFormKey}.auto_backup.plugins.enabled`}
          label='Enable Plugins Auto Backup'
        />
        {autoBackupPluginsEnabled && (
          <AutoBackupScheduleSet formKey={`${baseFormKey}.auto_backup.plugins`} />
        )}
      </Stack>
    </Expandable>
  );
}
