import { ToastType, useToast } from '@spooder/webui-component-library';
import {
  useGetConfigQuery,
  useGetOSCTunnelsQuery,
  useGetUdpServersQuery,
  useSaveConfigMutation,
} from '../api/configSlice';
import { FieldValues } from 'react-hook-form';

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

  return {
    getConfig,
    getUdpServers,
    getOSCTunnels,
    getSaveConfig,
  };
}
