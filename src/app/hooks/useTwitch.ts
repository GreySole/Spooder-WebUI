import { FieldValues } from 'react-hook-form';
import {
  useConvertEventSubToSpooderMutation,
  useDeleteEventSubMutation,
  useDisableTestEventsubMutation,
  useEnableTestEventsubMutation,
  useGetAvailableEventSubsQuery,
  useGetAvailableScopesQuery,
  useGetChannelPointRewardsQuery,
  useGetCliInstalledQuery,
  useGetConfigQuery,
  useGetEventSubsByUserQuery,
  useGetEventSubsQuery,
  useGetLinkedAccountsQuery,
  useGetTestEventsubStatusQuery,
  useGetUseWebhookTransportQuery,
  useInitEventSubMutation,
  useInstallCliMutation,
  useRefreshEventSubsMutation,
  useRevokeTokenMutation,
  useSaveAuthToBroadcasterMutation,
  useSaveTwitchConfigMutation,
  useSetUseWebhookTransportMutation,
  useTestEventsubMutation,
} from '../api/twitchSlice';
import { convertReactFormToFormData } from '@greysole/spooder-component-library';

export default function useTwitch() {
  function getTwitchConfig() {
    const { data, isLoading, error, refetch } = useGetConfigQuery(null);

    return { data, isLoading, error, refetch };
  }

  function getChannelPointRewards() {
    const { data, isLoading, error } = useGetChannelPointRewardsQuery(null);

    return { data, isLoading, error };
  }

  function getEventSubs() {
    const { data, isLoading, error, refetch } = useGetEventSubsQuery(null);

    return { data, isLoading, error, refetch };
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
    const { data, isLoading, error, refetch } = useGetEventSubsByUserQuery(twitchId);

    return { data, isLoading, error, refetch };
  }

  function getEventsubTestStatus() {
    const { data, isLoading, error, refetch } = useGetTestEventsubStatusQuery(null);

    return { data, isLoading, error, refetch };
  }

  function getUseWebhookTransport() {
    const { data, isLoading, error, refetch } = useGetUseWebhookTransportQuery(null);

    return { data, isLoading, error, refetch };
  }

  function getCliInstalled() {
    const { data, isLoading, error, refetch } = useGetCliInstalledQuery(null);

    return { data, isLoading, error, refetch };
  }

  function getInstallCli() {
    const [installCliMutation, { isLoading, isSuccess, error }] = useInstallCliMutation();
    function installCli() {
      return installCliMutation(null);
    }
    return { installCli, isLoading, isSuccess, error };
  }

  function getSetUseWebhookTransport() {
    const [setUseWebhookTransportMutation, { isLoading, isSuccess, error }] =
      useSetUseWebhookTransportMutation();

    function setUseWebhookTransport(useWebhookTransport: boolean) {
      return setUseWebhookTransportMutation({ useWebhookTransport });
    }

    return { setUseWebhookTransport, isLoading, isSuccess, error };
  }

  function getEnableTestEventsub(host: string, port: number) {
    const [enableTestEventsubMutation, { isLoading, isSuccess, error }] =
      useEnableTestEventsubMutation();
    function triggerEnableTestEventsub() {
      return enableTestEventsubMutation({ host, port });
    }
    return { triggerEnableTestEventsub, isLoading, isSuccess, error };
  }

  function getDisableTestEventsub() {
    const [disableTestEventsubMutation, { isLoading, isSuccess, error }] =
      useDisableTestEventsubMutation();
    function triggerDisableTestEventsub() {
      return disableTestEventsubMutation(null);
    }
    return { triggerDisableTestEventsub, isLoading, isSuccess, error };
  }

  function getTestEventsub() {
    const [testEventsubMutation, { isLoading, isSuccess, error }] = useTestEventsubMutation();
    function testEventsub(eventType: string, args?: string) {
      return testEventsubMutation({ type: eventType, args });
    }
    return { testEventsub, isLoading, isSuccess, error };
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
      return saveTwitchConfigMutation(form);
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
      return initEventSubMutation({ type, user_id });
    }
    return { initEventSub, isLoading, isSuccess, error };
  }

  function getRefreshEventSubs() {
    const [refreshEventSubsMutation, { isLoading, isSuccess, error }] =
      useRefreshEventSubsMutation();
    function refreshEventSubs() {
      return refreshEventSubsMutation(null);
    }
    return { refreshEventSubs, isLoading, isSuccess, error };
  }

  function getDeleteEventSub() {
    const [deleteEventSubMutation, { isLoading, isSuccess, error }] = useDeleteEventSubMutation();
    function deleteEventSub(subId: string) {
      return deleteEventSubMutation(subId);
    }
    return { deleteEventSub, isLoading, isSuccess, error };
  }

  return {
    getTestEventsub,
    getUseWebhookTransport,
    getSetUseWebhookTransport,
    getTwitchConfig,
    getChannelPointRewards,
    getAvailableEventSubs,
    getAvailableScopes,
    getLinkedAccounts,
    getEventSubs,
    getEventSubsByUser,
    getRevokeToken,
    getEventsubTestStatus,
    getCliInstalled,
    getInstallCli,
    getEnableTestEventsub,
    getDisableTestEventsub,
    getSaveAuthToBroadcaster,
    getSaveTwitchConfig,
    getConvertEventSubToSpooder,
    getInitEventSub,
    getRefreshEventSubs,
    getDeleteEventSub,
  };
}
