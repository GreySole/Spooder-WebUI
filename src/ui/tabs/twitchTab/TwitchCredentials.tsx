import {
  Border,
  Box,
  FormTextInput,
  SaveButton,
  Stack,
  useToast,
  ToastType,
} from '@greysole/spooder-component-library';
import React, { useEffect } from 'react';
import useTwitch from '../../../app/hooks/useTwitch';
import { FieldValues } from 'react-hook-form';

export default function TwitchCredentials() {
  const { getSaveTwitchConfig } = useTwitch();
  const { saveTwitchConfig, isLoading, isSuccess, error } = getSaveTwitchConfig();
  const { showError, showSuccess } = useToast();

  useEffect(() => {
    if (isSuccess) {
      showSuccess('Twitch configuration saved successfully!');
    } else if (error) {
      showError('An error occurred while saving Twitch configuration.');
    }
  }, [isSuccess, showError, showSuccess, error]);

  const saveTwitchConfigHandler = (form: FieldValues) => {
    saveTwitchConfig(form);
  };

  return (
    <Stack spacing='medium' width='100%' paddingBottom='medium'>
      <FormTextInput label='Client ID' formKey='client-id' />
      <FormTextInput label='Client Secret' formKey='client-secret' />

      <Box>
        <SaveButton saveFunction={saveTwitchConfigHandler} />
      </Box>
    </Stack>
  );
}
