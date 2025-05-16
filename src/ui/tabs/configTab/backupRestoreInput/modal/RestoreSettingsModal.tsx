import { Box, Modal } from '@greysole/spooder-component-library';
import React from 'react';
import BackupSettingsInput from '../input/BackupSettingsInput';
import RestoreSettingsInput from '../input/RestoreSettingsInput';

interface RestoreSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function RestoreSettingsModal(props: RestoreSettingsModalProps) {
  const { isOpen, setIsOpen } = props;
  return (
    <Modal
      title='Restore Settings'
      isOpen={isOpen}
      content={<RestoreSettingsInput />}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );
}
