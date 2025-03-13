import React, { useState } from 'react';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { Button, Modal } from '@greysole/spooder-component-library';
import CreatePluginModalContent from './CreatePluginModalContent';

interface CreatePluginModalProps {
  setIsOpen: (isOpen: boolean) => void;
  isOpen: boolean;
}

export default function CreatePluginModal(props: CreatePluginModalProps) {
  const { setIsOpen, isOpen } = props;

  return (
    <Modal
      isOpen={isOpen}
      title='Create Plugin'
      content={<CreatePluginModalContent />}
      onClose={() => setIsOpen(!isOpen)}
    />
  );
}
