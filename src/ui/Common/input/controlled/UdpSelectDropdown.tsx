import React from 'react';
import useConfig from '../../../../app/hooks/useConfig';
import SelectDropdown from './SelectDropdown';

interface UdpSelectDropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function UdpSelectDropdown(props: UdpSelectDropdownProps) {
  const { label, value, onChange } = props;
  const { getUdpClients } = useConfig();
  const { data: udpClients, isLoading, error } = getUdpClients();
  if (isLoading || error) {
    return null;
  }

  const udpOptions = [
    { label: 'None', value: '-1' },
    { label: 'All', value: '-2' },
  ];

  for (let u in udpClients) {
    udpOptions.push({
      label: udpClients[u],
      value: u,
    });
  }

  return <SelectDropdown label={label} options={udpOptions} value={value} onChange={onChange} />;
}
