import React from 'react';
import FormDiscordChannelSelect from '../../../common/input/form/FormDiscordChannelSelect';

interface DiscordAutoSendNgrokProps {
  formKey: string;
}

export default function DiscordAutoSendNgrok(props: DiscordAutoSendNgrokProps) {
  const { formKey } = props;

  return (
    <div className='config-variable'>
      <FormDiscordChannelSelect formKey={`${formKey}.autosendngrok`} />
    </div>
  );
}
