import { Button, TextInput } from '@spooder/webui-component-library';
import React, { useState } from 'react';

interface AddressFilterProps {
  addresses: string[];
  setAddresses: (addresses: string[]) => void;
}

export default function AddressFilter(props: AddressFilterProps) {
  const { addresses, setAddresses } = props;
  const [addressInput, setAddressInput] = useState('');

  return (
    <div className={'monitor-filters-address-input'}>
      <TextInput
        label='Address Filter'
        onInput={(value) => setAddressInput(value)}
        value={addressInput}
      />
      <Button label='Add' onClick={() => setAddresses([...addresses, addressInput])} />
    </div>
  );
}
