import React from 'react';
import CircleLoader from '../common/loader/CircleLoader';
import { FormProvider, useForm } from 'react-hook-form';
import OSCTunnelList from './oscTunnels/OSCTunnelList';
import SaveTunnelFormButton from './oscTunnels/SaveTunnelFormButton';
import useConfig from '../../app/hooks/useConfig';
import Box from '../common/layout/Box';
import Stack from '../common/layout/Stack';
import OSCTunnelTabContextProvider from './oscTunnels/context/OSCTunnelTabContext';

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
