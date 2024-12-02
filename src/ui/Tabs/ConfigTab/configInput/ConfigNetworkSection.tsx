import React from 'react';
import FormNumberInput from '../../../common/input/form/FormNumberInput';
import FormTextInput from '../../../common/input/form/FormTextInput';
import Stack from '../../../common/layout/Stack';
import Expandable from '../../../common/layout/Expandable';

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
