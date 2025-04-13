import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  TextInput,
  NumberInput,
  Button,
  Columns,
  Modal,
  Stack,
  TypeFace,
  Box,
} from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';

export default function AddUdpServer() {
  const [name, setName] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState<number>(9000);
  const { setValue } = useFormContext();
  const baseFormKey = 'network.osc.udp_servers';
  const addUdpServer = () => {
    const keyName = name
      .replace(/\s+/g, '_')
      .toLowerCase()
      .replace(/[^a-z0-9_]/g, '');
    setValue(`${baseFormKey}.${keyName}`, {
      name,
      ip,
      port,
    });
    setName('');
    setIp('');
    setPort(9000);
  };

  return (
    <Stack width='100%' spacing='medium' padding='medium'>
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
      <Box width='100%' justifyContent='right'>
        <Button label='Add UDP Server' onClick={() => addUdpServer()} />
      </Box>
    </Stack>
  );
}
