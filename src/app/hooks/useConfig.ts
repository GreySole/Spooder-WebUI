import { ToastType, useToast } from '@greysole/spooder-component-library';
import {
  useGetConfigQuery,
  useGetOSCTunnelsQuery,
  useGetUdpServersQuery,
  useSaveConfigMutation,
} from '../api/configSlice';
import { FieldValues } from 'react-hook-form';

export default function useConfig() {
  const { showToast } = useToast();

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

      saveConfigMutation(form)
        .unwrap()
        .then(() => {
          showToast('Config saved successfully!', ToastType.SUCCESS);
        })
        .catch((err) => {
          showToast(`Error saving config: ${err.message}`, ToastType.ERROR);
        });
    }

    return { saveConfig, isLoading, isSuccess, error };
  }

  return {
    getConfig,
    getUdpServers,
    getOSCTunnels,
    getSaveConfig,
  };
}
