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

  function getRevokeToken() {
    const [revokeTokenMutation, { isLoading, isSuccess, error }] = useRevokeTokenMutation();
    function revokeToken(type: string, user_id: string) {
      revokeTokenMutation(null);
    }
    return { revokeToken, isLoading, isSuccess, error };
  }

  function getSaveAuthToBroadcaster() {
    const [saveAuthToBroadcasterMutation, { isLoading, isSuccess, error }] =
      useSaveAuthToBroadcasterMutation();
    function saveAuthToBroadcaster(type: string, user_id: string) {
      saveAuthToBroadcasterMutation(null);
    }
    return { saveAuthToBroadcaster, isLoading, isSuccess, error };
  }

  function getSaveTwitchConfig() {
    const [saveTwitchConfigMutation, { isLoading, isSuccess, error }] =
      useSaveTwitchConfigMutation();
    function saveTwitchConfig(form: FormData) {
      saveTwitchConfigMutation(form);
    }
    return { saveTwitchConfig, isLoading, isSuccess, error };
  }

  function getConvertEventsubToSpooder() {
    const [convertEventsubToSpooderMutation, { isLoading, isSuccess, error }] =
      useConvertEventsubToSpooderMutation();
    function convertEventsubToSpooder() {
      convertEventsubToSpooderMutation(null);
    }
    return { convertEventsubToSpooder, isLoading, isSuccess, error };
  }

  function getInitEventsub() {
    const [initEventsubMutation, { isLoading, isSuccess, error }] = useInitEventsubMutation();
    function initEventsub(type: string, user_id: string) {
      initEventsubMutation({ type, user_id });
    }
    return { initEventsub, isLoading, isSuccess, error };
  }

  function getRefreshEventsubs() {
    const [refreshEventsubsMutation, { isLoading, isSuccess, error }] =
      useRefreshEventsubsMutation();
    function refreshEventsubs() {
      refreshEventsubsMutation(null);
    }
    return { refreshEventsubs, isLoading, isSuccess, error };
  }

  function getDeleteEventsub() {
    const [deleteEventsubMutation, { isLoading, isSuccess, error }] = useDeleteEventsubMutation();
    function deleteEventsub(subId: string) {
      deleteEventsubMutation(subId);
    }
    return { deleteEventsub, isLoading, isSuccess, error };
  }

  return {
    getTwitchConfig,
    getChannelPointRewards,
    getEventsubs,
    getEventsubTypes,
    getEventsubsByUser,
    getEventsubsList,
    getRevokeToken,
    getSaveAuthToBroadcaster,
    getSaveTwitchConfig,
    getConvertEventsubToSpooder,
    getInitEventsub,
    getRefreshEventsubs,
    getDeleteEventsub,
  };
}
