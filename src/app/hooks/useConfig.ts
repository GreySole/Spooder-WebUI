import { useDispatch, useSelector } from 'react-redux';
import { _setSave } from '../slice/hotkeySlice';
import { IRootState } from '../store';
import {
  useGetConfigQuery,
  useGetUdpClientsQuery,
  useSaveConfigMutation,
} from '../api/configSlice';

export default function useConfig() {
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

  async function saveConfig(form: FormData) {
    const [saveConfig] = useSaveConfigMutation();
    try {
      const result = await saveConfig(form).unwrap();
      return {
        data: result,
        error: null,
      };
    } catch (error) {
      return {
        data: null,
        error: error,
      };
    }
  }

  return { getConfig, getUdpClients, saveConfig };
}
