import React from 'react';
import { Footer } from '../../../app/Footer';
import SaveButton from '../../../common/input/form/SaveButton';
import Box from '../../../common/layout/Box';
import Expandable from '../../../common/layout/Expandable';
import Stack from '../../../common/layout/Stack';
import EditCustomSpooder from '../customSpooderInput/EditCustomSpooder';
import ThemeColor from '../themeColor/ThemeColor';
import ConfigBotSection from './ConfigBotSection';
import ConfigNetworkSection from './ConfigNetworkSection';
import ExternalHandleSection from './ExternalHandleSection';
import UdpClientSection from './UdpClientSection';
import useConfig from '../../../../app/hooks/useConfig';
import { useFormContext } from 'react-hook-form';
import ResetButton from '../../../common/input/form/ResetButton';
import Columns from '../../../common/layout/Columns';

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
