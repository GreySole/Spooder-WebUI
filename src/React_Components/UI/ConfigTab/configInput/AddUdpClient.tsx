import { useState } from 'react';
import TextInput from '../../common/input/controlled/TextInput';
import NumberInput from '../../common/input/controlled/NumberInput';
import { useFormContext } from 'react-hook-form';

export default function AddUdpClient() {
  const [key, setKey] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [ip, setIp] = useState<string>('');
  const [port, setPort] = useState<number>(9000);
  const { setValue } = useFormContext();
  const baseFormKey = 'network.udp_clients';
  const addUdpClient = () => {
    setValue(`${baseFormKey}.${key}`, {
      name,
      ip,
      port,
    });
  };
  return (
    <div className='config-sub-var add'>
      <div className='config-sub-var-ui'>
        <TextInput
          label='Key:'
          value={key}
          onInput={(value) => setKey(value)}
          placeholder='Internal Name'
          jsonFriendly
        />
        <TextInput
          label='Name:'
          value={name}
          onInput={(value) => setName(value)}
          placeholder='Display Name'
        />
        <TextInput
          label='IP:'
          value={ip}
          onInput={(value) => setIp(value)}
          placeholder='Client local IP'
        />
        <NumberInput label='Port:' value={port} onInput={(value) => setPort(value)} />
      </div>
      <div className='config-sub-var-buttons'>
        <button type='button' className='add-button' onClick={() => addUdpClient()}>
          Add
        </button>
      </div>
    </div>
  );
}
