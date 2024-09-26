import LoadingCircle from '../UI/LoadingCircle';
import { FormProvider, useForm } from 'react-hook-form';
import OSCTunnelList from '../UI/OSCTunnels/OSCTunnelList';
import SaveTunnelFormButton from '../UI/OSCTunnels/SaveTunnelFormButton';
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
