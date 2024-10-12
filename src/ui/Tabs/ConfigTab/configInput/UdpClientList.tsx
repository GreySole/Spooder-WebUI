import React from 'react';
import { useFormContext } from 'react-hook-form';
import AddUdpClient from './AddUdpClient';
import Button from '../../../Common/input/controlled/Button';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import FormTextInput from '../../../Common/input/form/FormTextInput';
import FormNumberInput from '../../../Common/input/form/FormNumberInput';

export default function UdpClientList() {
  const { watch, setValue } = useFormContext();
  const baseFormKey = 'network.udp_clients';
  const udpClients = watch(baseFormKey, {});

  const deleteUdpClient = (key: string) => {
    const newClients = Object.assign(udpClients, {});
    delete newClients[key];
    setValue(baseFormKey, newClients);
  };

  return (
    <div className='config-variable'>
      {Object.keys(udpClients).map((key) => (
        <div className='config-sub-var'>
          <div className='config-sub-var-buttons'>
            <Button label='' icon={faTrash} onClick={() => deleteUdpClient(key)} />
          </div>
          <div className='config-sub-var-ui'>
            <label>{key}</label>
            <FormTextInput label='Name:' formKey={`${baseFormKey}.${key}.name`} />
            <FormTextInput label='IP:' formKey={`${baseFormKey}.${key}.ip`} />
            <FormNumberInput label='Port:' formKey={`${baseFormKey}.${key}.port`} />
          </div>
        </div>
      ))}
      <AddUdpClient />
    </div>
  );
}
