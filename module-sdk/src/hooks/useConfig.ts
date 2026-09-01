import { ToastType, useToast } from '@spooder/webui-component-library';
import {
  useGetConfigQuery,
  useGetOSCTunnelsQuery,
  useGetUdpServersQuery,
  useSaveConfigMutation,
  useSaveUdpServersMutation,
} from '../api/configSlice';
import { FieldValues } from 'react-hook-form';
import { KeyedObject } from '../types';

export default function useConfig() {
  const { showToast, showError, showSuccess } = useToast();

  function getConfig() {
    const { data, isLoading, error } = useGetConfigQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getUdpServers() {
    const { data, isLoading, error } = useGetUdpServersQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getOSCTunnels() {
    const { data, isLoading, error } = useGetOSCTunnelsQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getSaveConfig() {
    const [saveConfigMutation, { isLoading, isSuccess, error }] = useSaveConfigMutation();

    function saveConfig(form: FieldValues) {
      console.log('SAVING', form);

      return saveConfigMutation(form)
        .unwrap()
        .then(() => {
          showSuccess('Config saved successfully!');
        })
        .catch((err) => {
          showError(`Error saving config: ${err.message}`);
        });
    }

    return { saveConfig, isLoading, isSuccess, error };
  }

  // Saves only the UDP destination map (see /config/save_udp_servers). Callers outside the
  // config form use this rather than getSaveConfig: they hold the one list, not a whole
  // config to post back.
  function getSaveUdpServers() {
    const [saveUdpServersMutation, { isLoading, isSuccess, error }] = useSaveUdpServersMutation();

    // Resolves to whether the save landed, so a caller can hold on to what the user typed
    // when it didn't - the toast alone would leave a cleared form and nothing saved.
    function saveUdpServers(udpServers: KeyedObject): Promise<boolean> {
      return saveUdpServersMutation(udpServers)
        .unwrap()
        .then(() => {
          showSuccess('UDP servers saved!');
          return true;
        })
        .catch((err) => {
          showError(`Error saving UDP servers: ${err.message}`);
          return false;
        });
    }

    return { saveUdpServers, isLoading, isSuccess, error };
  }

  return {
    getConfig,
    getUdpServers,
    getOSCTunnels,
    getSaveConfig,
    getSaveUdpServers,
  };
}
