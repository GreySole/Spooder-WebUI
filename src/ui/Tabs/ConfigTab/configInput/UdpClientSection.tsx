import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Expandable,
  Box,
  Stack,
  Columns,
  TypeFace,
  FormTextInput,
  FormNumberInput,
  Button,
  SaveButton,
} from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useConfig from '../../../../app/hooks/useConfig';
import AddUdpClient from './AddUdpClient';

export default function UdpClientSection() {
  const { watch, setValue } = useFormContext();
  const { getSaveConfig } = useConfig();
  const { saveConfig } = getSaveConfig();
  const baseFormKey = 'network.udp_clients';
  const udpClients = watch(baseFormKey, {});

  const deleteUdpClient = (key: string) => {
    const newClients = Object.assign(udpClients, {});
    delete newClients[key];
    setValue(baseFormKey, newClients);
  };

  return (
    <Expandable label='UDP Clients'>
      <Box flexFlow='column' padding='medium'>
        <Stack spacing='medium' marginTop='medium'>
          {Object.keys(udpClients).map((key) => (
            <Columns spacing='medium'>
              <Stack spacing='medium'>
                <TypeFace fontSize='large'>{key}</TypeFace>
                <Stack spacing='medium' marginLeft='medium'>
                  <FormTextInput label='Name:' formKey={`${baseFormKey}.${key}.name`} />
                  <FormTextInput label='IP:' formKey={`${baseFormKey}.${key}.ip`} />
                  <FormNumberInput label='Port:' formKey={`${baseFormKey}.${key}.port`} />
                </Stack>
              </Stack>
              <Button label='' icon={faTrash} onClick={() => deleteUdpClient(key)} />
            </Columns>
          ))}
        </Stack>
        <AddUdpClient />
        <SaveButton saveFunction={saveConfig} />
      </Box>
    </Expandable>
  );
}
