import React from 'react';
import FormTextInput from '../../Common/input/form/FormTextInput';
import useTwitch from '../../../app/hooks/useTwitch';
import SaveButton from '../../Common/input/form/SaveButton';

export default function TwitchCredentials() {
  const { getSaveTwitchConfig } = useTwitch();
  const { saveTwitchConfig } = getSaveTwitchConfig();
  return (
    <div className='twitch-credentials'>
      <FormTextInput label='Client ID' formKey='client-id' />
      <FormTextInput label='Client Secret' formKey='client-secret' />

      <SaveButton saveFunction={saveTwitchConfig} />
    </div>
  );
}
