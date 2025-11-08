import React from 'react';
import { BoolSwitch, FormBoolSwitch, FormLoader, Stack } from '@greysole/spooder-component-library';
import useRecovery from '../../../../../app/hooks/useRecovery';
import { useForm } from 'react-hook-form';

export default function AutoBackupInput() {
  const { getSetAutoBackupSettings, getAutoBackupSettings } = useRecovery();
  const { data, isLoading } = getAutoBackupSettings();

  const methods = useForm();

  if (isLoading) {
    return <FormLoader />;
  }

  return (
    <Stack spacing='medium'>
      <Stack spacing='small'>{null}</Stack>
    </Stack>
  );
}
