import { Stack } from '@greysole/spooder-component-library';
import React from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import useRecovery from '../../../../../app/hooks/useRecovery';
import AutoBackupInput from '../input/AutoBackupInput';
import AutoBackupModal from '../modal/AutoBackupModal';

interface AutoBackupFormProps {
  autoBackupSettings: any;
}

export default function AutoBackupForm({ autoBackupSettings }: AutoBackupFormProps) {
  const { getSetAutoBackupSettings } = useRecovery();
  const { setAutoBackupSettings } = getSetAutoBackupSettings();
  const methods = useForm({
    defaultValues: autoBackupSettings,
  });

  const onSubmit = methods.handleSubmit((data) => {
    setAutoBackupSettings(data);
  });

  return (
    <FormProvider {...methods}>
      <AutoBackupModal />
    </FormProvider>
  );
}
