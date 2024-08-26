import useConfig from '../../../../../app/hooks/useConfig';
import FormSelectDropdown from './FormSelectDropdown';

interface FormUdpSelectDropdownProps {
  formKey: string;
  label?: string;
}

export default function FormUdpSelectDropdown(props: FormUdpSelectDropdownProps) {
  const { formKey, label } = props;
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

  return <FormSelectDropdown formKey={formKey} label={label} options={udpOptions} />;
}
