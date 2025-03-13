import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  TextInput,
  NumberInput,
  Button,
  Columns,
  Modal,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

interface AddUdpClientModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function AddUdpClientModal(props: AddUdpClientModalProps) {
  const { isOpen, setIsOpen } = props;
  const [key, setKey] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState<number>(9000);
  const { setValue } = useFormContext();
  const baseFormKey = 'network.udp_clients';
  const addUdpClient = () => {
    setValue(`${baseFormKey}.${key}`, {
      name,
      ip,
      port,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      title={name}
      content={
        <Columns spacing='medium'>
          <Stack spacing='medium' marginLeft='medium'>
            <TextInput
              label='Key:'
              value={key}
              onInput={(value) => setKey(value)}
              placeholder='Internal Name'
              jsonFriendly
            />
            <TextInput
              label='Name:'
              value={name}
              onInput={(value) => setName(value)}
              placeholder='Display Name'
            />
            <TextInput
              label='IP:'
              value={ip}
              onInput={(value) => setIp(value)}
              placeholder='Client local IP'
            />
            <NumberInput label='Port:' value={port} onInput={(value) => setPort(value)} />
          </Stack>
        </Columns>
      }
      onClose={() => setIsOpen(false)}
      footerContent={<Button label='Add' onClick={() => addUdpClient()} />}
    />
  );
}
