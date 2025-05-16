import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Border,
  Box,
  Button,
  Columns,
  FormNumberInput,
  FormTextInput,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface EditUdpServerProps {
  formKey: string;
}

export default function EditUdpServer(props: EditUdpServerProps) {
  const { formKey } = props;
  const { watch, setValue } = useFormContext();
  const baseFormKey = 'network.osc.udp_servers';
  const udpServers = watch(baseFormKey, {});
  const deleteUdpServer = (key: string) => {
    const newClients = Object.assign(udpServers, {});
    delete newClients[key];
    setValue(baseFormKey, newClients);
  };
  return (
    <Border borderBottom>
      <Box flexFlow='row' justifyContent='space-between' alignItems='center'>
        <Stack width='80%' spacing='small'>
          <TypeFace fontSize='large'>{formKey}</TypeFace>
          <Columns width='100%' spacing='medium' overflow='auto'>
            <FormTextInput width='10rem' label='Name:' formKey={`${baseFormKey}.${formKey}.name`} />
            <FormTextInput width='10rem' label='IP:' formKey={`${baseFormKey}.${formKey}.ip`} />
            <FormNumberInput
              width='8rem'
              label='Port:'
              formKey={`${baseFormKey}.${formKey}.port`}
            />
          </Columns>
        </Stack>

        <Button icon={faTrash} onClick={() => deleteUdpServer(formKey)} />
      </Box>
    </Border>
  );
}
