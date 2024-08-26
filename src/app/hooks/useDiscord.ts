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

  async function saveDiscordConfig(form: FormData) {
    const [saveDiscordConfig] = useSaveDiscordConfigMutation();
    try {
      const result = await saveDiscordConfig(form).unwrap();
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
    getChannels,
    getConfig,
    getUser,
    saveDiscordConfig,
  };
}
