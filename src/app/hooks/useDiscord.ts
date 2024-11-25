import { FieldValue, FieldValues, get } from 'react-hook-form';
import {
  useGetConfigQuery,
  useGetGuildsQuery,
  useGetUserQuery,
  useSaveDiscordConfigMutation,
} from '../api/discordSlice';

export default function useDiscord() {
  function getDiscordGuilds() {
    const { data, isLoading, error } = useGetGuildsQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getDiscordConfig() {
    const { data, isLoading, error } = useGetConfigQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getDiscordUser() {
    const { data, isLoading, error } = useGetUserQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getSaveDiscordConfig() {
    const [saveDiscordConfigMutation, { isLoading, isSuccess, error }] =
      useSaveDiscordConfigMutation();
    function saveDiscordConfig(form: FieldValues) {
      saveDiscordConfigMutation(form);
    }

    return { saveDiscordConfig, isLoading, isSuccess, error };
  }

  return {
    getDiscordGuilds,
    getDiscordConfig,
    getDiscordUser,
    getSaveDiscordConfig,
  };
}
