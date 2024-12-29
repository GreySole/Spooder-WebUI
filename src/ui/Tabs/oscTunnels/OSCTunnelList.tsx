import React from 'react';
import FormSelectDropdown from '../../common/input/form/FormSelectDropdown';
import FormTextInput from '../../common/input/form/FormTextInput';
import useConfig from '../../../app/hooks/useConfig';
import usePlugins from '../../../app/hooks/usePlugins';
import { useFormContext, useWatch } from 'react-hook-form';
import DeleteOSCTunnelButton from './DeleteOSCTunnelButton';
import AddTunnelForm from './AddTunnelForm';
import { KeyedObject } from '../../Types';
import FormLoader from '../../common/loader/FormLoader';
import Stack from '../../common/layout/Stack';
import Box from '../../common/layout/Box';
import Columns from '../../common/layout/Columns';
import Border from '../../common/layout/Border';
import TypeFace from '../../common/layout/TypeFace';

export default function OSCTunnelList() {
  const { getUdpClients } = useConfig();
  const { getPlugins } = usePlugins();
  const { watch, setValue, getValues } = useFormContext();
  const tunnels = watch();

  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  const {
    data: udpClients,
    isLoading: udpClientsLoading,
    error: udpClientsError,
  } = getUdpClients();

  if (udpClientsLoading || pluginsLoading || udpClientsError || pluginsError) {
    return <FormLoader numRows={4} />;
  }

  const table = [];

  const clientTable = [];

  const onAddOSCTunnel = (newTunnel: KeyedObject) => {
    console.log('Adding new tunnel', newTunnel);
    setValue(`${newTunnel.name}`, newTunnel);
    console.log(getValues());
  };

  console.log('TUNNELS', tunnels);

  for (let u in udpClients) {
    clientTable.push({ value: u, label: udpClients[u].name });
  }

  const pluginTable = [];

  for (let p in plugins) {
    pluginTable.push({ value: p, label: plugins[p].name });
  }

  for (let s in tunnels) {
    table.push(
      <Border borderWidth='2px' borderColor='grey' borderBottom key={s}>
        <Columns spacing='medium' padding='small'>
          <Stack spacing='medium'>
            <TypeFace fontSize='medium'>{s}</TypeFace>
            <FormSelectDropdown
              formKey={`${s}.handlerFrom`}
              label='Handler From'
              options={[
                { value: 'tcp', label: 'TCP (Overlays)' },
                { value: 'udp', label: 'UDP' },
              ]}
            />
            <FormSelectDropdown
              formKey={`${s}.handlerTo`}
              label='Handler To'
              options={[
                { value: 'tcp', label: 'TCP (Overlays)' },
                { value: 'plugin', label: 'Plugin' },
                { value: 'udp', label: 'UDP' },
              ]}
            />
            {tunnels[s]['handlerTo'] == 'udp' ? (
              <FormSelectDropdown formKey={`${s}.clientTo`} options={clientTable} />
            ) : null}
            {tunnels[s]['handlerTo'] == 'plugin' ? (
              <FormSelectDropdown formKey={`${s}.clientTo`} options={pluginTable} />
            ) : null}
            <FormTextInput formKey={`${s}.addressFrom`} label='Address From' />
            <FormTextInput formKey={`${s}.addressTo`} label='Address To' />
          </Stack>
          <DeleteOSCTunnelButton formKey={s} />
        </Columns>
      </Border>,
    );
  }

  return (
    <Stack spacing='medium'>
      {table}
      <AddTunnelForm onAddOSCTunnel={(newTunnels) => onAddOSCTunnel(newTunnels)} />
    </Stack>
  );
}
