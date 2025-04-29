import React from 'react';
import useConfig from '../../app/hooks/useConfig';
import {
  Box,
  CircleLoader,
  Columns,
  ResetButton,
  Stack,
} from '@greysole/spooder-component-library';
import OSCTunnelTabContextProvider from './oscTunnels/context/OSCTunnelTabContext';
import OSCTunnelList from './oscTunnels/OSCTunnelList';
import SaveTunnelFormButton from './oscTunnels/SaveTunnelFormButton';
import { Footer } from '../app/Footer';

export default function OSCTunnelTab() {
  const { getOSCTunnels } = useConfig();
  const { data: tunnels, isLoading: tunnelsLoading, error: tunnelsError } = getOSCTunnels();

  if (tunnelsLoading || tunnelsError) {
    return <CircleLoader></CircleLoader>;
  }

  return (
    <OSCTunnelTabContextProvider tunnels={tunnels}>
      <Box width='100%' marginBottom='var(--footer-height)' padding='medium'>
        <OSCTunnelList />
      </Box>
      <Footer showFooter={true}>
        <Box padding='medium' width='100%' justifyContent='flex-end'>
          <Columns spacing='medium'>
            <ResetButton />
            <SaveTunnelFormButton />
          </Columns>
        </Box>
      </Footer>
    </OSCTunnelTabContextProvider>
  );
}
