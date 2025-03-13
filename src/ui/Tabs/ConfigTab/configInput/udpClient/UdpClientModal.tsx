import { faTrash } from '@fortawesome/free-solid-svg-icons';
import {
  Button,
  Columns,
  FormNumberInput,
  FormTextInput,
  Modal,
  Stack,
  TypeFace,
} from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import useConfig from '../../../../../app/hooks/useConfig';
import { buildKey } from '../../../eventsTab/FormKeys';

interface UdpClientModalProps {
  formKey: string;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function UdpClientModal(props: UdpClientModalProps) {
  const { formKey, isOpen, setIsOpen } = props;
  const { watch, getValues, setValue } = useFormContext();
  const clientName = watch(buildKey(formKey, 'name'), '');
  const baseFormKey = 'network.udp_clients';
  const deleteUdpClient = (key: string) => {
    const newClients = getValues(baseFormKey);
    delete newClients[key];
    setValue(baseFormKey, newClients);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={clientName}
      content={
        <Columns spacing='medium'>
          <Stack spacing='medium'>
            <TypeFace fontSize='large'>{formKey}</TypeFace>
            <Stack spacing='medium' marginLeft='medium'>
              <FormTextInput label='Name:' formKey={`${baseFormKey}.${formKey}.name`} />
              <FormTextInput label='IP:' formKey={`${baseFormKey}.${formKey}.ip`} />
              <FormNumberInput label='Port:' formKey={`${baseFormKey}.${formKey}.port`} />
            </Stack>
          </Stack>
          <Button label='' icon={faTrash} onClick={() => deleteUdpClient(formKey)} />
        </Columns>
      }
      onClose={() => setIsOpen(false)}
    />
  );
}
