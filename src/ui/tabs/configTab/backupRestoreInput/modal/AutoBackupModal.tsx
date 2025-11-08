import React from 'react';
import { Box, Button, Modal } from '@greysole/spooder-component-library';
import AutoBackupInput from '../input/AutoBackupInput';
import { faSave } from '@fortawesome/free-solid-svg-icons';

interface AutoBackupModalProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

export default function AutoBackupModal(props: AutoBackupModalProps) {
  const { isOpen, setIsOpen } = props;

  return (
    <Modal
      title='Auto Backup'
      isOpen={isOpen}
      content={<AutoBackupInput />}
      onClose={() => {
        setIsOpen(false);
      }}
      footerContent={
        <Box width='100%' justifyContent='flex-end'>
          <Button label='Save' icon={faSave} onClick={() => setIsOpen(false)} />
        </Box>
      }
    />
  );
}
