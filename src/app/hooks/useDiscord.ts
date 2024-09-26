import { get } from 'react-hook-form';
import {
  useGetChannelsQuery,
  useGetConfigQuery,
  useGetUserQuery,
  useSaveDiscordConfigMutation,
} from '../api/discordSlice';

export default function useDiscord() {
  function getChannels() {
    const { data, isLoading, error } = useGetChannelsQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getConfig() {
    const { data, isLoading, error } = useGetConfigQuery(null);
    return {
      data,
      isLoading,
      error,
    };
  }

  function getUser() {
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
    function saveDiscordConfig(form: FormData) {
      saveDiscordConfigMutation(form);
    }

    return { saveDiscordConfig, isLoading, isSuccess, error };
  }

  return {
    getChannels,
    getConfig,
    getUser,
    getSaveDiscordConfig,
  };
}
