import React from 'react';
import FormTextInput from '../../../common/input/form/FormTextInput';

export default function ConfigBotSection() {
  const baseFormKey = 'bot';

  return (
    <div className='config-section'>
      <FormTextInput formKey={`${baseFormKey}.owner_name`} label='Owner Name' />
      <FormTextInput formKey={`${baseFormKey}.bot_name`} label='Bot Name' />
      <FormTextInput formKey={`${baseFormKey}.help_command`} label='Help Command' />
      <FormTextInput formKey={`${baseFormKey}.introduction`} label='Introduction' />
    </div>
  );
}
