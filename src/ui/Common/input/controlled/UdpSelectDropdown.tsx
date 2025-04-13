import React from 'react';
import useConfig from '../../../../app/hooks/useConfig';
import { SelectDropdown } from '@greysole/spooder-component-library';

interface UdpSelectDropdownProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

export default function UdpSelectDropdown(props: UdpSelectDropdownProps) {
  const { label, value, onChange } = props;
  const { getUdpServers } = useConfig();
  const { data: udpServers, isLoading, error } = getUdpServers();
  if (isLoading || error) {
    return null;
  }

  const udpOptions = [
    { label: 'None', value: '-1' },
    { label: 'All', value: '-2' },
  ];

  for (let u in udpServers) {
    udpOptions.push({
      label: udpServers[u],
      value: u,
    });
  }

  return <SelectDropdown label={label} options={udpOptions} value={value} onChange={onChange} />;
}
