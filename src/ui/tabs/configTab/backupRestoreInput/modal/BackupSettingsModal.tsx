import { Box, Modal } from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import BackupSettingsInput from '../input/BackupSettingsInput';
import RestoreSettingsInput from '../input/RestoreSettingsInput';

interface BackupSettingsModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function BackupSettingsModal(props: BackupSettingsModalProps) {
  const { isOpen, setIsOpen } = props;
  return (
    <Modal
      title='Backup Settings'
      isOpen={isOpen}
      content={<BackupSettingsInput />}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );
}
