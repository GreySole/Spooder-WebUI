import React from 'react';
import { Footer } from '../../../app/Footer';
import {
  Stack,
  Box,
  Columns,
  ResetButton,
  SaveButton,
  LinkButton,
  Button,
  ToastType,
  useToast,
} from '@greysole/spooder-component-library';
import useConfig from '../../../../app/hooks/useConfig';
import ConfigBotSection from './ConfigBotSection';
import ConfigNetworkSection from './ConfigNetworkSection';
import ExternalHandleSection from './ExternalHandleSection';
import UdpServerSection from './UdpServerSection';
import useServer from '../../../../app/hooks/useServer';

export default function ConfigForm() {
  const { getSaveConfig } = useConfig();
  const { saveConfig } = getSaveConfig();
  const { getPublicUrl } = useServer();
  const { data: publicUrls, isLoading: publicUrlLoading } = getPublicUrl();
  return (
    <>
      <Stack spacing='medium'>
        <ConfigBotSection />
        <ConfigNetworkSection />
        <ExternalHandleSection />
        <UdpServerSection />
      </Stack>
      <Footer showFooter={true}>
        <Box width='100%' justifyContent='space-between'>
          {publicUrlLoading ? (
            <Box> </Box>
          ) : (
            <Box>
              <LinkButton label={'Copy Mod URL'} mode='copy' link={publicUrls.http + '/mod'} />
            </Box>
          )}
          <Box>
            <SaveButton saveFunction={saveConfig} />
          </Box>
        </Box>
      </Footer>
    </>
  );
}
