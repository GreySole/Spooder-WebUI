import { FieldValue, FieldValues, get } from 'react-hook-form';
import {
  useGetConfigQuery,
  useGetGuildsQuery,
  useGetUserQuery,
  useSaveDiscordConfigMutation,
  useVerifyDiscordTargetMutation,
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
    const { data, isLoading, error, refetch } = useGetConfigQuery(null);
    return {
      data,
      isLoading,
      error,
      refetch,
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

  function getVerifyDiscordTarget() {
    const [verifyDiscordTargetMutation, { data, isLoading, error }] =
      useVerifyDiscordTargetMutation();
    function verifyDiscordTarget() {
      verifyDiscordTargetMutation(null);
    }
    return {
      verifyDiscordTarget,
      data,
      isLoading,
      error,
    };
  }

  function getSaveDiscordConfig() {
    const [saveDiscordConfigMutation, { isLoading, isSuccess, error }] =
      useSaveDiscordConfigMutation();
    function saveDiscordConfig(form: FieldValues) {
      return saveDiscordConfigMutation(form);
    }

    return { saveDiscordConfig, isLoading, isSuccess, error };
  }

  return {
    getDiscordGuilds,
    getDiscordConfig,
    getDiscordUser,
    getVerifyDiscordTarget,
    getSaveDiscordConfig,
  };
}
