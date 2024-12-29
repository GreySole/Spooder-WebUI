import React from 'react';
import { useFormContext } from 'react-hook-form';
import AddUdpClient from './AddUdpClient';
import Button from '../../../common/input/controlled/Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import FormTextInput from '../../../common/input/form/FormTextInput';
import FormNumberInput from '../../../common/input/form/FormNumberInput';
import Columns from '../../../common/layout/Columns';
import Stack from '../../../common/layout/Stack';
import TypeFace from '../../../common/layout/TypeFace';
import { StyleSize } from '../../../Types';
import Box from '../../../common/layout/Box';
import Expandable from '../../../common/layout/Expandable';
import useConfig from '../../../../app/hooks/useConfig';
import SaveButton from '../../../common/input/form/SaveButton';

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
