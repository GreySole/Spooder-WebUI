import { Modal } from '@greysole/spooder-component-library';
import React from 'react';
import BackupPluginsInput from '../input/BackupPluginsInput';

interface BackupPluginsModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function BackupPluginsModal(props: BackupPluginsModalProps) {
  const { isOpen, setIsOpen } = props;
  return (
    <Modal
      title='Backup Plugins'
      isOpen={isOpen}
      content={<BackupPluginsInput />}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );
}
