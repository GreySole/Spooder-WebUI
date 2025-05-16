import React from 'react';
import useConfig from '../../../app/hooks/useConfig';
import usePlugins from '../../../app/hooks/usePlugins';
import { useFormContext, useWatch } from 'react-hook-form';
import { KeyedObject } from '../../Types';
import {
  FormLoader,
  Border,
  Stack,
  TypeFace,
  FormSelectDropdown,
  FormTextInput,
  Box,
  useTheme,
} from '@greysole/spooder-component-library';
import AddTunnelForm from './AddTunnelForm';
import DeleteOSCTunnelButton from './DeleteOSCTunnelButton';

export default function OSCTunnelList() {
  const { getUdpServers } = useConfig();
  const { getPlugins } = usePlugins();
  const { watch, setValue, getValues } = useFormContext();
  const { isMobileDevice } = useTheme();
  const tunnels = watch();

  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  const {
    data: udpServers,
    isLoading: udpServersLoading,
    error: udpServersError,
  } = getUdpServers();

  if (udpServersLoading || pluginsLoading || udpServersError || pluginsError) {
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

  for (let u in udpServers) {
    clientTable.push({ value: u, label: udpServers[u].name });
  }

  const pluginTable = [];

  for (let p in plugins) {
    pluginTable.push({ value: p, label: plugins[p].name });
  }

  for (let s in tunnels) {
    table.push(
      <Border key={s} borderBottom>
        <Box width='100%' padding='small' justifyContent='space-between' alignItems='center'>
          <Stack width='100%' spacing='medium' paddingRight='medium'>
            <TypeFace fontSize='xlarge'>{s}</TypeFace>
            <FormSelectDropdown
              width={isMobileDevice ? '100%' : undefined}
              formKey={`${s}.handlerFrom`}
              label='Handler From'
              options={[
                { value: 'tcp', label: 'TCP (Overlays)' },
                { value: 'udp', label: 'UDP' },
              ]}
            />
            <FormSelectDropdown
              width={isMobileDevice ? '100%' : undefined}
              formKey={`${s}.handlerTo`}
              label='Handler To'
              options={[
                { value: 'tcp', label: 'TCP (Overlays)' },
                { value: 'plugin', label: 'Plugin' },
                { value: 'udp', label: 'UDP' },
              ]}
            />
            {tunnels[s]['handlerTo'] == 'udp' ? (
              <FormSelectDropdown
                width={isMobileDevice ? '100%' : undefined}
                formKey={`${s}.clientTo`}
                options={clientTable}
              />
            ) : null}
            {tunnels[s]['handlerTo'] == 'plugin' ? (
              <FormSelectDropdown
                width={isMobileDevice ? '100%' : undefined}
                formKey={`${s}.clientTo`}
                options={pluginTable}
              />
            ) : null}
            <FormTextInput
              width={isMobileDevice ? '100%' : undefined}
              formKey={`${s}.addressFrom`}
              label='Address From'
            />
            <FormTextInput
              width={isMobileDevice ? '100%' : undefined}
              formKey={`${s}.addressTo`}
              label='Address To'
            />
          </Stack>
          <DeleteOSCTunnelButton formKey={s} />
        </Box>
      </Border>,
    );
  }

  return (
    <Stack width='100%' spacing='medium'>
      {table}
      <AddTunnelForm onAddOSCTunnel={(newTunnels) => onAddOSCTunnel(newTunnels)} />
    </Stack>
  );
}
