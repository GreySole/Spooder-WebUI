import {
  Expandable,
  Stack,
  FormTextInput,
  FormNumberInput,
} from '@greysole/spooder-component-library';
import React from 'react';

export default function ConfigNetworkSection() {
  const baseFormKey = 'network';

  return (
    <Expandable label='Network'>
      <Stack spacing='medium' padding='medium'>
        <FormTextInput formKey={`${baseFormKey}.host`} label='Hosting IP' />
        <FormTextInput formKey={`${baseFormKey}.host_port`} label='Hosting Port' />
        <FormNumberInput formKey={`${baseFormKey}.osc_udp_port`} label='OSC UDP Port' />
        <FormNumberInput formKey={`${baseFormKey}.osc_tcp_port`} label='OSC TCP Port' />
      </Stack>
    </Expandable>
  );
}
