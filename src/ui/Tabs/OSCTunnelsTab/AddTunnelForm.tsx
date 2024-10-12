import React from 'react';
import { useState } from 'react';
import useConfig from '../../../app/hooks/useConfig';
import usePlugins from '../../../app/hooks/usePlugins';
import SelectDropdown from '../../Common/input/controlled/SelectDropdown';
import TextInput from '../../Common/input/controlled/TextInput';
import { KeyedObject } from '../../Types';
import { HotkeysProvider } from '../../../app/hooks/useHotkeys';

interface AddTunnelFormProps {
  onAddOSCTunnel: (newTunnel: KeyedObject) => void;
}

export default function AddTunnelForm(props: AddTunnelFormProps) {
  const { onAddOSCTunnel } = props;
  const { getUdpClients } = useConfig();
  const { getPlugins } = usePlugins();
  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  const {
    data: udpClients,
    isLoading: udpClientsLoading,
    error: udpClientsError,
  } = getUdpClients();

  const [name, setName] = useState('');
  const [addressFrom, setAddressFrom] = useState('/');
  const [addressTo, setAddressTo] = useState('/');
  const [clientTo, setClientTo] = useState('');
  const [handlerFrom, setHandlerFrom] = useState('udp');
  const [handlerTo, setHandlerTo] = useState('tcp');

  let clientTable = [];

  for (let u in udpClients) {
    clientTable.push({ value: u, label: udpClients[u].name });
  }

  let pluginTable = [];

  for (let p in plugins) {
    pluginTable.push({ value: p, label: plugins[p].name });
  }

  const handleAddButton = () =>
    onAddOSCTunnel({ name, addressFrom, addressTo, clientTo, handlerFrom, handlerTo });

  return (
    <div className='add-osc-var'>
      <div className='config-variable'>
        <TextInput label='Name' value={name} onInput={(value) => setName(value)} jsonFriendly />
        <SelectDropdown
          label='Handler From'
          options={[
            { value: 'tcp', label: 'TCP (Overlays)' },
            { value: 'udp', label: 'UDP' },
          ]}
          value={handlerFrom}
          onChange={(value) => setHandlerFrom(value)}
        />
        <SelectDropdown
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
            options={clientTable}
            value={clientTo}
            onChange={(value) => setClientTo(value)}
          />
        ) : null}
        {handlerTo == 'plugin' ? (
          <SelectDropdown
            options={pluginTable}
            value={clientTo}
            onChange={(value) => setClientTo(value)}
          />
        ) : null}

        <TextInput
          label='Address From'
          value={addressFrom}
          onInput={(value) => setAddressFrom(value)}
        />
        <TextInput label='Address To' value={addressTo} onInput={(value) => setAddressTo(value)} />
      </div>
      <HotkeysProvider enter={() => handleAddButton()}>
        <button type='button' className='add-button' onClick={() => handleAddButton()}>
          Add
        </button>
      </HotkeysProvider>
    </div>
  );
}
