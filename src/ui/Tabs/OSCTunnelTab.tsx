import React from 'react';
import LoadingCircle from '../common/LoadingCircle';
import { FormProvider, useForm } from 'react-hook-form';
import OSCTunnelList from './oscTunnels/OSCTunnelList';
import SaveTunnelFormButton from './oscTunnels/SaveTunnelFormButton';
import useConfig from '../../app/hooks/useConfig';

export default function OSCTunnelTab() {
  const { getOSCTunnels } = useConfig();
  const { data: tunnels, isLoading: tunnelsLoading, error: tunnelsError } = getOSCTunnels();
  const oscTunnelForm = useForm({
    defaultValues: tunnels,
  });

  if (tunnelsLoading || tunnelsError) {
    return <LoadingCircle></LoadingCircle>;
  }

  return (
    <div className='config-tab'>
      <FormProvider {...oscTunnelForm}>
        <OSCTunnelList />
        <SaveTunnelFormButton />
      </FormProvider>
    </div>
  );
}
