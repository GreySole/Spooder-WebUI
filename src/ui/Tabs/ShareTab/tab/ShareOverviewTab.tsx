import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import FormTextInput from '../../../common/input/form/FormTextInput';
import LinkButton from '../../../common/input/general/LinkButton';
import ToggleShareButton from '../input/ToggleShareButton';
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
    <Box padding='10px'>
      <Stack spacing='10px'>
        <FormTextInput formKey={`${shareKey}.joinMessage`} label='Join Message' />
        <FormTextInput formKey={`${shareKey}.leaveMessage`} label='Leave Message' />
      </Stack>
    </Box>
  );
}
