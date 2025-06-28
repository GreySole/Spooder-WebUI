import { SpooderPetPair } from '@greysole/spooder-component-library';
import { KeyedObject } from '../../ui/Types';
import {
  useGetCustomSpooderQuery,
  useGetMainThemeQuery,
  useSaveCustomSpooderMutation,
  useSaveThemeMutation,
} from '../api/themeSlice';

export default function useThemeApi() {
  function getMainTheme() {
    const { data, isLoading, error } = useGetMainThemeQuery(null);
    return { data, isLoading, error };
  }

  function getSaveTheme() {
    const [saveThemeMutation, { isLoading, isSuccess, error }] = useSaveThemeMutation();
    function saveTheme(hue: number, saturation: number, isDarkTheme: boolean) {
      saveThemeMutation({ hue, saturation, isDarkTheme });
    }

    return { saveTheme, isLoading, isSuccess, error };
  }

  function getCustomSpooder() {
    const { data, isLoading, error } = useGetCustomSpooderQuery(null);
    return { data, isLoading, error };
  }

  function getSaveCustomSpooder() {
    const [saveCustomSpooderMutation, { isLoading, isSuccess, error }] =
      useSaveCustomSpooderMutation();
    function saveCustomSpooder(customSpooder: SpooderPetPair[]) {
      saveCustomSpooderMutation(customSpooder);
    }

    return { saveCustomSpooder, isLoading, isSuccess, error };
  }

  return { getSaveTheme, getMainTheme, getCustomSpooder, getSaveCustomSpooder };
}
