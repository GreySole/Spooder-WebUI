import { FormTextInput } from '@greysole/spooder-component-library';
import React from 'react';

export default function DiscordLoginSettings() {
  return (
    <>
      <div className='config-variable'>
        <FormTextInput formKey={`master`} label='Master User ID' />
      </div>
      <div className='config-variable'>
        <FormTextInput formKey={`token`} label='Bot Token' password />
      </div>
    </>
  );
}
