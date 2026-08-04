import React from 'react';
import useConfig from '../../../../app/hooks/useConfig';
import { FormSelectDropdown } from '@spooder/webui-component-library';

interface FormUdpSelectDropdownProps {
  formKey: string;
  label?: string;
}

export default function FormUdpSelectDropdown(props: FormUdpSelectDropdownProps) {
  const { formKey, label } = props;
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
      label: udpServers[u].name,
      value: u,
    });
  }

  return <FormSelectDropdown formKey={formKey} label={label} options={udpOptions} />;
}
