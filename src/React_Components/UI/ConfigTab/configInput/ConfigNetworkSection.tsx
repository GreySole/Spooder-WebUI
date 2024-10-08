import React from 'react';
import FormNumberInput from '../../common/input/form/FormNumberInput';
import FormTextInput from '../../common/input/form/FormTextInput';
import ExternalHandle from './ExternalHandle';
import UdpClientList from './UdpClientList';

export default function ConfigNetworkSection() {
  const baseFormKey = 'network';

  return (
    <div className='config-section'>
      <FormTextInput formKey={`${baseFormKey}.host`} label='Hosting IP' />
      <FormTextInput formKey={`${baseFormKey}.host_port`} label='Hosting Port' />
      <ExternalHandle />
      <UdpClientList />
      <FormNumberInput formKey={`${baseFormKey}.osc_udp_port`} label='OSC UDP Port' />
      <FormNumberInput formKey={`${baseFormKey}.osc_tcp_port`} label='OSC TCP Port' />
    </div>
  );
}
