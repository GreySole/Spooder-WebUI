import {
  Box,
  FormTextInput,
  Expandable,
  BoolSwitch,
  Stack,
} from '@spooder/webui-component-library';
import React from 'react';

export default function EditUserModalContent() {
  return (
    <Stack spacing='medium'>
      <FormTextInput formKey={`username`} label='Username' />
      <FormTextInput formKey={`display_name`} label='Display Name' />
    </Stack>
  );
}
