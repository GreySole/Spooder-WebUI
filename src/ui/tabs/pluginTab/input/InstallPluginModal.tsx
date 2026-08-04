import React from 'react';
import { Modal } from '@spooder/webui-component-library';
import InstallPluginModalContent from './InstallPluginModalContent';

interface InstallPluginModalProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

export default function InstallPluginModal(props: InstallPluginModalProps) {
  const { setIsOpen, isOpen } = props;

  return (
    <Modal
      title='Install Plugin'
      isOpen={isOpen}
      content={<InstallPluginModalContent setIsModalOpen={setIsOpen} />}
      onClose={() => setIsOpen(!isOpen)}
    />
  );
}
