import { FormTextInput, SaveButton } from '@greysole/spooder-component-library';
import React from 'react';
import useTwitch from '../../../app/hooks/useTwitch';

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
