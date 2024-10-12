import { FieldValues } from 'react-hook-form';
import {
  useConvertEventSubToSpooderMutation,
  useDeleteEventSubMutation,
  useGetAvailableEventSubsQuery,
  useGetAvailableScopesQuery,
  useGetChannelPointRewardsQuery,
  useGetConfigQuery,
  useGetEventSubsByUserQuery,
  useGetEventSubsQuery,
  useGetLinkedAccountsQuery,
  useInitEventSubMutation,
  useRefreshEventSubsMutation,
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

  function getEventSubs() {
    const { data, isLoading, error } = useGetEventSubsQuery(null);

    return { data, isLoading, error };
  }

  function getAvailableEventSubs() {
    const { data, isLoading, error } = useGetAvailableEventSubsQuery(null);

    return { data, isLoading, error };
  }

  function getAvailableScopes() {
    const { data, isLoading, error } = useGetAvailableScopesQuery(null);

    return { data, isLoading, error };
  }

  function getLinkedAccounts() {
    const { data, isLoading, error } = useGetLinkedAccountsQuery(null);

    return { data, isLoading, error };
  }

  function getEventSubsByUser(twitchId: string) {
    const { data, isLoading, error } = useGetEventSubsByUserQuery(twitchId);

    return { data, isLoading, error };
  }

  function getRevokeToken() {
    const [revokeTokenMutation, { isLoading, isSuccess, error }] = useRevokeTokenMutation();
    function revokeToken() {
      revokeTokenMutation(null);
    }
    return { revokeToken, isLoading, isSuccess, error };
  }

  function getSaveAuthToBroadcaster() {
    const [saveAuthToBroadcasterMutation, { isLoading, isSuccess, error }] =
      useSaveAuthToBroadcasterMutation();
    function saveAuthToBroadcaster() {
      saveAuthToBroadcasterMutation(null);
    }
    return { saveAuthToBroadcaster, isLoading, isSuccess, error };
  }

  function getSaveTwitchConfig() {
    const [saveTwitchConfigMutation, { isLoading, isSuccess, error }] =
      useSaveTwitchConfigMutation();
    function saveTwitchConfig(form: FieldValues) {
      const formData = new FormData();
      for (const [key, value] of Object.entries(form)) {
        formData.append(key, value);
      }
      saveTwitchConfigMutation(formData);
    }
    return { saveTwitchConfig, isLoading, isSuccess, error };
  }

  function getConvertEventSubToSpooder() {
    const [convertEventSubToSpooderMutation, { isLoading, isSuccess, error }] =
      useConvertEventSubToSpooderMutation();
    function convertEventSubToSpooder() {
      convertEventSubToSpooderMutation(null);
    }
    return { convertEventSubToSpooder, isLoading, isSuccess, error };
  }

  function getInitEventSub() {
    const [initEventSubMutation, { isLoading, isSuccess, error }] = useInitEventSubMutation();
    function initEventSub(type: string, user_id: string) {
      initEventSubMutation({ type, user_id });
    }
    return { initEventSub, isLoading, isSuccess, error };
  }

  function getRefreshEventSubs() {
    const [refreshEventSubsMutation, { isLoading, isSuccess, error }] =
      useRefreshEventSubsMutation();
    function refreshEventSubs() {
      refreshEventSubsMutation(null);
    }
    return { refreshEventSubs, isLoading, isSuccess, error };
  }

  function getDeleteEventSub() {
    const [deleteEventSubMutation, { isLoading, isSuccess, error }] = useDeleteEventSubMutation();
    function deleteEventSub(subId: string) {
      deleteEventSubMutation(subId);
    }
    return { deleteEventSub, isLoading, isSuccess, error };
  }

  return {
    getTwitchConfig,
    getChannelPointRewards,
    getAvailableEventSubs,
    getAvailableScopes,
    getLinkedAccounts,
    getEventSubs,
    getEventSubsByUser,
    getRevokeToken,
    getSaveAuthToBroadcaster,
    getSaveTwitchConfig,
    getConvertEventSubToSpooder,
    getInitEventSub,
    getRefreshEventSubs,
    getDeleteEventSub,
  };
}
