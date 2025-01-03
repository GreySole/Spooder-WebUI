import React from 'react';
import useConfig from '../../app/hooks/useConfig';
import { CircleLoader, Stack } from '@greysole/spooder-component-library';
import OSCTunnelTabContextProvider from './oscTunnels/context/OSCTunnelTabContext';
import OSCTunnelList from './oscTunnels/OSCTunnelList';
import SaveTunnelFormButton from './oscTunnels/SaveTunnelFormButton';

export default function OSCTunnelTab() {
  const { getOSCTunnels } = useConfig();
  const { data: tunnels, isLoading: tunnelsLoading, error: tunnelsError } = getOSCTunnels();

  if (tunnelsLoading || tunnelsError) {
    return <CircleLoader></CircleLoader>;
  }

  return (
    <OSCTunnelTabContextProvider tunnels={tunnels}>
      <Stack spacing='medium'>
        <OSCTunnelList />
        <SaveTunnelFormButton />
      </Stack>
    </OSCTunnelTabContextProvider>
  );
}
