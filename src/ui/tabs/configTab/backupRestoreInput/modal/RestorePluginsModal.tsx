import { Box, Modal } from '@spooder/webui-component-library';
import React, { useState } from 'react';
import BackupSettingsInput from '../input/BackupSettingsInput';
import RestoreSettingsInput from '../input/RestoreSettingsInput';
import RestorePluginsInput from '../input/RestorePluginsInput';
import { set } from 'react-hook-form';

interface RestorePluginsModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function RestorePluginsModal(props: RestorePluginsModalProps) {
  const { isOpen, setIsOpen } = props;
  return (
    <Modal
      title='Restore Plugins'
      isOpen={isOpen}
      content={<RestorePluginsInput />}
      onClose={() => {
        setIsOpen(false);
      }}
    />
  );
}
