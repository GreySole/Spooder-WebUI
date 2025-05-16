import React from 'react';
import { Stack, TypeFace, FormTextInput } from '@greysole/spooder-component-library';

export default function MotherwolfHandle() {
  return (
    <Stack spacing='small'>
      <TypeFace>
        Motherwolf isn't publicly available yet. If you were invited to use Motherwolf, fill in the
        credentials here.
      </TypeFace>
      <FormTextInput label='Auth Token' formKey='network.motherwolf.token' />
      <FormTextInput label='Subdomain' formKey='network.motherwolf.subdomain' />
    </Stack>
  );
}
