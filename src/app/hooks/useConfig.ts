import {
  useGetConfigQuery,
  useGetOSCTunnelsQuery,
  useGetUdpClientsQuery,
  useSaveConfigMutation,
} from '../api/configSlice';
import useToast from './useToast';
import { ToastType } from '../../ui/Types';
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

  function getUdpClients() {
    const { data, isLoading, error } = useGetUdpClientsQuery(null);
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

      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) {
        formData.append(key, value);
      }

      saveConfigMutation(formData)
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
    getUdpClients,
    getOSCTunnels,
    getSaveConfig,
  };
}
