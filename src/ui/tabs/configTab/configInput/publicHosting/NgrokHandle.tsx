import React from 'react';
import { FormTextInput, Stack, TypeFace } from '@greysole/spooder-component-library';

export default function NgrokHandle() {
  return (
    <Stack spacing='small'>
      <TypeFace>
        Create an account on{' '}
        <a target='_blank' rel='noreferrer' href='https://ngrok.io'>
          Ngrok
        </a>{' '}
        and paste your auth token here.
      </TypeFace>
      <FormTextInput label='Auth Token' formKey='network.ngrok.authtoken' />
    </Stack>
  );
}
