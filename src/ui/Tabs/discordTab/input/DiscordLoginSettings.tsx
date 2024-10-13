import React from 'react';
import FormTextInput from '../../../common/input/form/FormTextInput';

export default function DiscordLoginSettings() {
  return (
    <>
      <div className='config-variable'>
        <FormTextInput formKey={`master`} label='Master User ID' />
      </div>
      <div className='config-variable'>
        <FormTextInput formKey={`token`} label='Bot Token' />
      </div>
    </>
  );
}
