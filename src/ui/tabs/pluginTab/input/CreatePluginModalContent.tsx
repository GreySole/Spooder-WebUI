import {
  Stack,
  Box,
  FormTextInput,
  FormBoolSwitch,
  Border,
  TypeFace,
} from '@spooder/webui-component-library';
import React from 'react';

export default function CreatePluginModalContent() {
  return (
    <Stack spacing='medium'>
      <FormTextInput label='Name' formKey='name' />
      <FormTextInput label='Author' formKey='author' />
      <FormTextInput label='Description' formKey='description' />
      <FormBoolSwitch label='Typescript' formKey='typescript' />
      <Box>
        <Border>
          <Stack spacing='medium' padding='medium'>
            <TypeFace fontSize='large'>Pages</TypeFace>
            <FormBoolSwitch label='Overlay' formKey='pages.overlay' />
            <FormBoolSwitch label='Utility' formKey='pages.utility' />
            <FormBoolSwitch label='Public' formKey='pages.public' />
          </Stack>
        </Border>
      </Box>
    </Stack>
  );
}
