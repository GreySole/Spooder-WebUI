import React from 'react';
import { Footer } from '../../../app/Footer';
import { Stack, Box, Columns, ResetButton, SaveButton } from '@greysole/spooder-component-library';
import { useFormContext } from 'react-hook-form';
import useConfig from '../../../../app/hooks/useConfig';
import ConfigBotSection from './ConfigBotSection';
import ConfigNetworkSection from './ConfigNetworkSection';
import ExternalHandleSection from './ExternalHandleSection';
import UdpClientSection from './UdpClientSection';

export default function ConfigForm() {
  const { getConfig, getSaveConfig } = useConfig();
  const { saveConfig } = getSaveConfig();
  const { formState } = useFormContext();
  return (
    <Stack spacing='medium'>
      <ConfigBotSection />
      <ConfigNetworkSection />
      <ExternalHandleSection />
      <UdpClientSection />
      <Footer showFooter={formState.isDirty}>
        <Box width='100%' justifyContent='flex-end'>
          <Columns padding='small' spacing='medium'>
            <ResetButton />
            <SaveButton saveFunction={saveConfig} />
          </Columns>
        </Box>
      </Footer>
    </Stack>
  );
}
