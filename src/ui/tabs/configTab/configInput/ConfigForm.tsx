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
  const { showToast } = useToast();
  const { data: publicUrls, isLoading: publicUrlLoading } = getPublicUrl();
  console.log('publicUrls', publicUrls, publicUrlLoading);
  return (
    <>
      <Stack spacing='medium' padding='medium'>
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
            <Box padding='medium'>
              <LinkButton label={'Copy Mod URL'} mode='copy' link={publicUrls.http + '/mod'} />
              <Button
                label='Toast Test'
                onClick={() => {
                  showToast('Toast Test was clicked', ToastType.INFO);
                }}
              />
            </Box>
          )}
          <Box padding='medium'>
            <SaveButton saveFunction={saveConfig} />
          </Box>
        </Box>
      </Footer>
    </>
  );
}
