import React from 'react';
import { useState } from 'react';
import useConfig from '../../../app/hooks/useConfig';
import usePlugins from '../../../app/hooks/usePlugins';
import { KeyedObject } from '../../Types';
import { HotkeysProvider } from '../../../app/hooks/useHotkeys';
import {
  Stack,
  TextInput,
  SelectDropdown,
  Button,
  Box,
  useTheme,
} from '@spooder/webui-component-library';

interface AddTunnelFormProps {
  onAddOSCTunnel: (newTunnel: KeyedObject) => void;
}

export default function AddTunnelForm(props: AddTunnelFormProps) {
  const { onAddOSCTunnel } = props;
  const { getUdpServers } = useConfig();
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  const { data: udpServers } = getUdpServers();
  const { isMobileDevice } = useTheme();

  const [name, setName] = useState('');
  const [addressFrom, setAddressFrom] = useState('/');
  const [addressTo, setAddressTo] = useState('/');
  const [clientTo, setClientTo] = useState('');
  const [handlerFrom, setHandlerFrom] = useState('udp');
  const [handlerTo, setHandlerTo] = useState('tcp');

  let clientTable = [];

  for (let u in udpServers) {
    clientTable.push({ value: u, label: udpServers[u].name });
  }

  let pluginTable = [];

  for (let p in plugins) {
    pluginTable.push({ value: p, label: plugins[p].name });
  }

  const handleAddButton = () =>
    onAddOSCTunnel({ name, addressFrom, addressTo, clientTo, handlerFrom, handlerTo });

  return (
    <Stack spacing='small'>
      <TextInput
        width={isMobileDevice ? '100%' : undefined}
        label='Name'
        value={name}
        onInput={(value) => setName(value)}
        jsonFriendly
      />
      <SelectDropdown
        width={isMobileDevice ? '100%' : undefined}
        label='Handler From'
        options={[
          { value: 'tcp', label: 'TCP (Overlays)' },
          { value: 'udp', label: 'UDP' },
        ]}
        value={handlerFrom}
        onChange={(value) => setHandlerFrom(value)}
      />
      <SelectDropdown
        width={isMobileDevice ? '100%' : undefined}
        label='Handler To'
        options={[
          { value: 'tcp', label: 'TCP (Overlays)' },
          { value: 'plugin', label: 'Plugin' },
          { value: 'udp', label: 'UDP' },
        ]}
        value={handlerTo}
        onChange={(value) => setHandlerTo(value)}
      />

      {handlerTo == 'udp' ? (
        <SelectDropdown
          width={isMobileDevice ? '100%' : undefined}
          options={clientTable}
          value={clientTo}
          onChange={(value) => setClientTo(value)}
        />
      ) : null}
      {handlerTo == 'plugin' ? (
        <SelectDropdown
          width={isMobileDevice ? '100%' : undefined}
          options={pluginTable}
          value={clientTo}
          onChange={(value) => setClientTo(value)}
        />
      ) : null}

      <TextInput
        width={isMobileDevice ? '100%' : undefined}
        label='Address From'
        value={addressFrom}
        onInput={(value) => setAddressFrom(value)}
      />
      <TextInput
        width={isMobileDevice ? '100%' : undefined}
        label='Address To'
        value={addressTo}
        onInput={(value) => setAddressTo(value)}
      />
      <HotkeysProvider enter={() => handleAddButton()}>
        <Box width='100%' justifyContent='flex-end' marginTop='medium'>
          <Button label='Add' onClick={() => handleAddButton()} />
        </Box>
      </HotkeysProvider>
    </Stack>
  );
}
