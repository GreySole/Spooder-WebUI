import {
  useConvertEventsubToSpooderMutation,
  useDeleteEventsubMutation,
  useGetChannelPointRewardsQuery,
  useGetConfigQuery,
  useGetEventsubTypesQuery,
  useGetEventsubsByUserQuery,
  useGetEventsubsListQuery,
  useGetEventsubsQuery,
  useInitEventsubMutation,
  useRefreshEventsubsMutation,
  useRevokeTokenMutation,
  useSaveAuthToBroadcasterMutation,
  useSaveTwitchConfigMutation,
} from '../api/twitchSlice';

export default function useTwitch() {
  function getTwitchConfig() {
    const { data, isLoading, error } = useGetConfigQuery(null);

    return { data, isLoading, error };
  }

  function getChannelPointRewards() {
    const { data, isLoading, error } = useGetChannelPointRewardsQuery(null);

    return { data, isLoading, error };
  }

  function getEventsubs() {
    const { data, isLoading, error } = useGetEventsubsQuery(null);

    return { data, isLoading, error };
  }

  function getEventsubTypes() {
    const { data, isLoading, error } = useGetEventsubTypesQuery(null);

    return { data, isLoading, error };
  }

  function getEventsubsByUser(twitchId: string) {
    const { data, isLoading, error } = useGetEventsubsByUserQuery(twitchId);

    return { data, isLoading, error };
  }

  function getEventsubsList() {
    const { data, isLoading, error } = useGetEventsubsListQuery(null);

    return { data, isLoading, error };
  }

  async function revokeToken(type: string, user_id: string) {
    const [revokeToken] = useRevokeTokenMutation();
    try {
      const result = await revokeToken(null).unwrap();
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

  async function saveAuthToBroadcaster(type: string, user_id: string) {
    const [saveAuthToBroadcaster] = useSaveAuthToBroadcasterMutation();
    try {
      const result = await saveAuthToBroadcaster(null).unwrap();
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

  async function saveTwitchConfig(form: FormData) {
    const [saveTwitchConfig] = useSaveTwitchConfigMutation();
    try {
      const result = await saveTwitchConfig(form).unwrap();
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

  async function convertEventsubToSpooder() {
    const [convertEventsubToSpooder] = useConvertEventsubToSpooderMutation();
    try {
      const result = await convertEventsubToSpooder(null).unwrap();
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

  async function initEventsub(type: string, user_id: string) {
    const [initEventsub] = useInitEventsubMutation();
    try {
      const result = await initEventsub({ type, user_id }).unwrap();
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

  async function refreshEventsubs() {
    const [refreshEventsubs] = useRefreshEventsubsMutation();
    try {
      const result = await refreshEventsubs(null).unwrap();
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

  async function deleteEventsub(subId: string) {
    const [deleteEventsub] = useDeleteEventsubMutation();
    try {
      const result = await deleteEventsub(subId).unwrap();
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
    getTwitchConfig,
    getChannelPointRewards,
    getEventsubs,
    getEventsubTypes,
    getEventsubsByUser,
    getEventsubsList,
    revokeToken,
    saveAuthToBroadcaster,
    saveTwitchConfig,
    convertEventsubToSpooder,
    initEventsub,
    refreshEventsubs,
    deleteEventsub,
  };
}
