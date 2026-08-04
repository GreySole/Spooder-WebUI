import { Box, Stack, FormTextInput } from '@spooder/webui-component-library';
import React from 'react';

export default function ShareOverviewTab() {
  return (
    <Box width='100%' padding='small'>
      <Stack width='inherit' spacing='small'>
        <FormTextInput width='100%' formKey='joinMessage' label='Join Message' />
        <FormTextInput width='100%' formKey='leaveMessage' label='Leave Message' />
      </Stack>
    </Box>
  );
}
