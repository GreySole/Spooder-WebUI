import { FieldValues } from 'react-hook-form';
import {
  useConnectObsMutation,
  useGetObsSettingsQuery,
  useGetScenesQuery,
  useSaveObsSettingsMutation,
} from '../api/obsSlice';
import { convertReactFormToFormData } from '../../ui/common/Helpers';

export default function useOBS() {
  function getConnectObs() {
    const [connectObsMutation, { isLoading, isSuccess, error }] = useConnectObsMutation();
    function connectObs(host: string, port: number, password: string) {
      const fd = new FormData();
      fd.append('host', host);
      fd.append('port', port.toString());
      fd.append('password', password);
      return connectObsMutation(fd);
    }

    return { connectObs, isLoading, isSuccess, error };
  }

  function getObsSettings() {
    const { data, isLoading, error } = useGetObsSettingsQuery(null);
    return { data, isLoading, error };
  }

  function getScenes() {
    const { data, isLoading, error } = useGetScenesQuery(null);
    return { data, isLoading, error };
  }

  async function getSaveObsSettings() {
    const [saveObsSettingsMutation, { isLoading, isSuccess, error }] = useSaveObsSettingsMutation();
    function saveObsSettings(form: FieldValues) {
      const formData = convertReactFormToFormData(form);
      return saveObsSettingsMutation(formData);
    }

    return { saveObsSettings, isLoading, isSuccess, error };
  }

  return {
    getConnectObs,
    getObsSettings,
    getScenes,
    getSaveObsSettings,
  };
}
