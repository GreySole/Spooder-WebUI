import { Expandable, Stack, FormTextInput } from '@greysole/spooder-component-library';
import React from 'react';

export default function ConfigBotSection() {
  const baseFormKey = 'bot';

  return (
    <Expandable label='Bot'>
      <Stack spacing='medium' padding='medium'>
        <FormTextInput formKey={`${baseFormKey}.owner_name`} label='Owner Name' />
        <FormTextInput formKey={`${baseFormKey}.bot_name`} label='Bot Name' />
        <FormTextInput formKey={`${baseFormKey}.help_command`} label='Help Command' />
        <FormTextInput width='100%' formKey={`${baseFormKey}.introduction`} label='Introduction' />
      </Stack>
    </Expandable>
  );
}
