import {
  useGetObsSettingsQuery,
  useGetScenesQuery,
  useSaveObsSettingsMutation,
} from '../api/obsSlice';

export default function useOBS() {

  function getObsSettings() {
    const { data, isLoading, error } = useGetObsSettingsQuery(null);
    return { data, isLoading, error };
  }

  function getScenes() {
    const { data, isLoading, error } = useGetScenesQuery(null);
    return { data, isLoading, error };
  }

  async function saveObsSettings(form: FormData) {
    const [saveObsSettings] = useSaveObsSettingsMutation();
    try {
      const result = await saveObsSettings(form).unwrap();
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

  return {
    getObsSettings,
    getScenes,
    saveObsSettings,
  };
}
