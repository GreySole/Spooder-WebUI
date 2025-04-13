import React from 'react';
import { Stack, TypeFace, FormTextInput } from '@greysole/spooder-component-library';

export default function ManualHandle() {
  return (
    <Stack spacing='small'>
      <TypeFace>
        If you have your own server, you can use it to host Spooder. Use HTTPS urls to proxy HTTP
        requests and proxy OSC from overlays.
      </TypeFace>
      <FormTextInput label='HTTP URL' formKey='network.manual.http_url' />
      <FormTextInput label='OSC TCP URL' formKey='network.manual.tcp_url' />
    </Stack>
  );
}
