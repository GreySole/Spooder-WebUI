import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
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
  ButtonRow,
} from '@greysole/spooder-component-library';
import React, { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import useConfig from '../../../../app/hooks/useConfig';
import AddUdpClient from './AddUdpClient';
import UdpClientModal from './udpClient/UdpClientModal';
import { StyleSize } from '../../../Types';
import AddUdpClientModal from './AddUdpClient';

export default function UdpClientSection() {
  const { watch, setValue } = useFormContext();
  const { getSaveConfig } = useConfig();
  const { saveConfig } = getSaveConfig();
  const baseFormKey = 'network.udp_clients';
  const udpClients = watch(baseFormKey, {});
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editModalKey, setEditModalKey] = useState('');
  const [addModalOpen, setAddModalOpen] = useState(false);

  const deleteUdpClient = (key: string) => {
    const newClients = Object.assign(udpClients, {});
    delete newClients[key];
    setValue(baseFormKey, newClients);
  };

  return (
    <Expandable label='UDP Clients'>
      <UdpClientModal formKey={editModalKey} isOpen={editModalOpen} setIsOpen={setEditModalOpen} />
      <AddUdpClientModal isOpen={addModalOpen} setIsOpen={setAddModalOpen} />
      <Box flexFlow='column' padding='medium'>
        <Stack spacing='medium' marginTop='medium'>
          {Object.keys(udpClients).map((key) => (
            <Box key={key} flexFlow='row' justifyContent='space-between' alignItems='center'>
              <TypeFace fontSize='large'>{key}</TypeFace>
              <ButtonRow
                buttonSize='large'
                iconSize='large'
                buttons={[
                  {
                    icon: faEdit,
                    onClick: () => {
                      setEditModalKey(key);
                      setEditModalOpen(true);
                    },
                  },
                  { icon: faTrash, onClick: () => deleteUdpClient(key) },
                ]}
              />
            </Box>
          ))}
          <Box width='100%' justifyContent='right' padding='medium'>
            <Button label='Add UDP Client' onClick={() => setAddModalOpen(true)} />
          </Box>
        </Stack>
      </Box>
    </Expandable>
  );
}
