import { Box, Stack, FormTextInput } from '@greysole/spooder-component-library';
import React from 'react';
import { useFormContext } from 'react-hook-form';

interface ShareEntryProps {
  shareKey: string;
}

export default function ShareOverviewTab({ shareKey }: ShareEntryProps) {
  const { watch, setValue } = useFormContext();
  const share = watch(shareKey);

  return (
    <Box width='100%' padding='small'>
      <Stack width='inherit' spacing='small'>
        <FormTextInput width='100%' formKey={`${shareKey}.joinMessage`} label='Join Message' />
        <FormTextInput width='100%' formKey={`${shareKey}.leaveMessage`} label='Leave Message' />
      </Stack>
    </Box>
  );
}
