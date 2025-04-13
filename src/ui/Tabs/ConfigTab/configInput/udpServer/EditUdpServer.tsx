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
        <Stack spacing='small'>
          <TypeFace fontSize='large'>{formKey}</TypeFace>
          <Columns spacing='medium' overflow='auto'>
            <FormTextInput label='Name:' formKey={`${baseFormKey}.${formKey}.name`} />
            <FormTextInput label='IP:' formKey={`${baseFormKey}.${formKey}.ip`} />
            <FormNumberInput label='Port:' formKey={`${baseFormKey}.${formKey}.port`} />
          </Columns>
        </Stack>

        <Button icon={faTrash} onClick={() => deleteUdpServer(formKey)} />
      </Box>
    </Border>
  );
}
