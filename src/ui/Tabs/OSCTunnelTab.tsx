import React from 'react';
import CircleLoader from '../common/loader/CircleLoader';
import { FormProvider, useForm } from 'react-hook-form';
import OSCTunnelList from './oscTunnels/OSCTunnelList';
import SaveTunnelFormButton from './oscTunnels/SaveTunnelFormButton';
import useConfig from '../../app/hooks/useConfig';
import Box from '../common/layout/Box';
import Stack from '../common/layout/Stack';

export default function OSCTunnelTab() {
  const { getOSCTunnels } = useConfig();
  const { data: tunnels, isLoading: tunnelsLoading, error: tunnelsError } = getOSCTunnels();
  const oscTunnelForm = useForm({
    defaultValues: tunnels,
  });

  if (tunnelsLoading || tunnelsError) {
    return <CircleLoader></CircleLoader>;
  }

  return (
    <FormProvider {...oscTunnelForm}>
      <Stack spacing='medium'>
        <OSCTunnelList />
        <SaveTunnelFormButton />
      </Stack>
    </FormProvider>
  );
}
