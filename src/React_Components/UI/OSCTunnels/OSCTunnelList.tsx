import React from 'react';
import FormSelectDropdown from '../common/input/form/FormSelectDropdown';
import FormTextInput from '../common/input/form/FormTextInput';
import useConfig from '../../../app/hooks/useConfig';
import usePlugins from '../../../app/hooks/usePlugins';
import LoadingCircle from '../LoadingCircle';
import { useFormContext, useWatch } from 'react-hook-form';
import DeleteOSCTunnelButton from './DeleteOSCTunnelButton';
import AddTunnelForm from './AddTunnelForm';
import { KeyedObject } from '../../Types';

export default function OSCTunnelList() {
  const { getUdpClients } = useConfig();
  const { getPlugins } = usePlugins();
  const { watch, setValue, control, getValues } = useFormContext();
  const tunnels = watch('tunnels', {});

  const { data: plugins, isLoading: pluginsLoading, error: pluginsError } = getPlugins();
  const {
    data: udpClients,
    isLoading: udpClientsLoading,
    error: udpClientsError,
  } = getUdpClients();

  if (udpClientsLoading || pluginsLoading || udpClientsError || pluginsError) {
    return <LoadingCircle></LoadingCircle>;
  }

  const table = [];

  const clientTable = [];

  const onAddOSCTunnel = (newTunnel: KeyedObject) => {
    console.log('Adding new tunnel', newTunnel);
    setValue(`tunnels.${newTunnel.name}`, newTunnel);
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
      <div className='config-variable' key={s}>
        <div className='config-variable-ui'>
          <label>{s}</label>
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
        </div>
        <div className='config-variable-buttons'>
          <DeleteOSCTunnelButton formKey={s} />
        </div>
      </div>,
    );
  }

  return (
    <>
      {table}
      <AddTunnelForm onAddOSCTunnel={(newTunnels) => onAddOSCTunnel(newTunnels)} />
    </>
  );
}
