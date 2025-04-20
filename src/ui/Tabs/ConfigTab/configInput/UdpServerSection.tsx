import { Expandable, Box, Stack } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import EditUdpServer from './udpServer/EditUdpServer';
import AddUdpServer from './udpServer/AddUdpServer';

export default function UdpServerSection() {
  const { watch } = useFormContext();
  const baseFormKey = 'network.osc.udp_servers';
  const udpServers = watch(baseFormKey, {});

  return (
    <Expandable label='UDP Servers'>
      <Box flexFlow='column' padding='medium'>
        <Stack width='100%' spacing='medium' marginTop='medium' padding='medium'>
          {Object.keys(udpServers).map((key) => (
            <EditUdpServer formKey={key} key={key} />
          ))}
        </Stack>
        <Box width='100%'>
          <AddUdpServer />
        </Box>
      </Box>
    </Expandable>
  );
}
