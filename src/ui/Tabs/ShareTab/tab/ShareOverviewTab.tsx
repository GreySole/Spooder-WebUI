import React from 'react';
import FormTextInput from '../../../common/input/form/FormTextInput';
import { useFormContext } from 'react-hook-form';
import Stack from '../../../common/layout/Stack';
import Box from '../../../common/layout/Box';

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
