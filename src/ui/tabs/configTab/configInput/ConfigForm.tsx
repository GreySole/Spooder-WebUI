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
} from '@spooder/webui-component-library';
import useConfig from '../../../../app/hooks/useConfig';
import ConfigBotSection from './ConfigBotSection';
import ConfigNetworkSection from './ConfigNetworkSection';
import ExternalHandleSection from './ExternalHandleSection';
import UdpServerSection from './UdpServerSection';
import useServer from '../../../../app/hooks/useServer';
import AutoBackupSection from './AutoBackupSection';
import AutoUpdateSection from './AutoUpdateSection';

export default function ConfigForm() {
  const { getSaveConfig } = useConfig();
  const { saveConfig } = getSaveConfig();
  const { getPublicUrl } = useServer();
  const { data: publicUrls, isLoading: publicUrlLoading } = getPublicUrl();
  return (
    <>
      <ConfigBotSection />
      <ConfigNetworkSection />
      <ExternalHandleSection />
      <UdpServerSection />
      <AutoBackupSection />
      <AutoUpdateSection />
      <Footer showFooter>
        {publicUrlLoading ? (
          <Box> </Box>
        ) : (
          <LinkButton label={'Copy Mod URL'} mode='copy' link={publicUrls.http + '/mod'} />
        )}
        <SaveButton saveFunction={saveConfig} />
      </Footer>
    </>
  );
}
