import { FormLoader } from '@greysole/spooder-component-library';
import React from 'react';
import { useForm } from 'react-hook-form';
import useRecovery from '../../../../../app/hooks/useRecovery';
import AutoBackupModal from '../modal/AutoBackupModal';

interface AutoBackupModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function AutoBackupFormModal(props: AutoBackupModalProps) {
  const { isOpen, setIsOpen } = props;

  const { getSetAutoBackupSettings, getAutoBackupSettings } = useRecovery();
  const { data, isLoading } = getAutoBackupSettings();

  const methods = useForm();

  if (isLoading) {
    return <FormLoader />;
  }

  return <AutoBackupModal isOpen={isOpen} setIsOpen={setIsOpen} />;
}
