import { FieldValues } from 'react-hook-form';
import {
  useConnectObsMutation,
  useGetObsSettingsQuery,
  useGetObsStatusQuery,
  useGetScenesQuery,
  useSaveObsSettingsMutation,
} from '../api/obsSlice';
import { convertReactFormToFormData } from '../../ui/util/DataUtil';

export default function useOBS() {
  function getConnectObs() {
    const [connectObsMutation, { isLoading, isSuccess, error }] = useConnectObsMutation();
    function connectObs(host: string, port: number, password: string, remember: boolean) {
      return connectObsMutation({
        host,
        port,
        password,
        remember,
      });
    }

    return { connectObs, isLoading, isSuccess, error };
  }

  function getObsStatus() {
    const { data, isLoading, error, refetch } = useGetObsStatusQuery(null);
    return { data, isLoading, error, refetch };
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
      return saveObsSettingsMutation(form);
    }

    return { saveObsSettings, isLoading, isSuccess, error };
  }

  return {
    getConnectObs,
    getObsStatus,
    getObsSettings,
    getScenes,
    getSaveObsSettings,
  };
}
