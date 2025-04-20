import { Border, Box, FormTextInput, SaveButton, Stack } from '@greysole/spooder-component-library';
import React from 'react';
import useTwitch from '../../../app/hooks/useTwitch';

export default function TwitchCredentials() {
  const { getSaveTwitchConfig } = useTwitch();
  const { saveTwitchConfig } = getSaveTwitchConfig();
  return (
    <Border borderBottom>
      <Stack spacing='medium' padding='medium'>
        <FormTextInput label='Client ID' formKey='client-id' />
        <FormTextInput label='Client Secret' formKey='client-secret' />

        <Box>
          <SaveButton saveFunction={saveTwitchConfig} />
        </Box>
      </Stack>
    </Border>
  );
}
