import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { KeyedObject } from '../../ui/Types';

export const twitchApi = createApi({
  reducerPath: 'twitchApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/twitch' }),
  endpoints: (builder) => ({
    getEventSubs: builder.query({
      query: () => '/get_eventsubs',
    }),
    getAvailableEventSubs: builder.query({
      query: () => '/get_available_eventsubs',
    }),
    getAvailableScopes: builder.query({
      query: () => '/get_available_scopes',
    }),
    getLinkedAccounts: builder.query({
      query: () => '/get_linked_accounts',
    }),
    getUseWebhookTransport: builder.query({
      query: () => '/get_eventsub_use_webhook',
    }),
    getConfig: builder.query({
      query: () => '/get_config',
    }),
    getChannelPointRewards: builder.query({
      query: () => '/get_channelpoint_rewards',
      transformResponse: (response: KeyedObject) => response.data,
    }),
    getEventSubsByUser: builder.query({
      query: (twitchId: string) => `/get_eventsubs_by_user?twitchid=${twitchId}`,
    }),
    getTestEventsubStatus: builder.query({
      query: () => '/get_test_eventsub_status',
    }),
    getCliInstalled: builder.query({
      query: () => '/is_cli_installed',
    }),
    installCli: builder.mutation({
      query: () => ({
        url: '/install_cli',
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setUseWebhookTransport: builder.mutation({
      query: ({ useWebhookTransport }) => ({
        url: `/set_eventsub_use_webhook`,
        method: 'POST',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({ useWebhookTransport }),
      }),
    }),
    enableTestEventsub: builder.mutation({
      query: ({ host, port }) => ({
        url: `/enable_test_eventsub?host=${host}&port=${port}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    disableTestEventsub: builder.mutation({
      query: () => ({
        url: `/disable_test_eventsub`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    testEventsub: builder.mutation({
      query: ({ type, args }) => ({
        url: `/test_eventsub`,
        method: 'post',
        body: JSON.stringify({ type, args }),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    revokeToken: builder.mutation({
      query: () => ({
        url: `/revoke`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveAuthToBroadcaster: builder.mutation({
      query: () => ({
        url: `/save_auth_to_broadcaster`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    convertEventSubToSpooder: builder.mutation({
      query: () => ({
        url: `/convertEventSubToSpooder`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveTwitchConfig: builder.mutation({
      query: (form) => ({
        url: '/saveConfig',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    refreshEventSubs: builder.mutation({
      query: () => ({
        url: `/refresh_eventsubs`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    initEventSub: builder.mutation({
      query: ({ type, user_id }) => ({
        url: `/init_eventsub?type=${type}&user_id=${user_id}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteEventSub: builder.mutation({
      query: (subId: string) => ({
        url: `/delete_eventsub?id=${subId}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const {
  useTestEventsubMutation,
  useGetUseWebhookTransportQuery,
  useSetUseWebhookTransportMutation,
  useConvertEventSubToSpooderMutation,
  useGetEventSubsQuery,
  useGetAvailableEventSubsQuery,
  useGetAvailableScopesQuery,
  useGetLinkedAccountsQuery,
  useGetConfigQuery,
  useGetChannelPointRewardsQuery,
  useGetEventSubsByUserQuery,
  useGetCliInstalledQuery,
  useInstallCliMutation,
  useGetTestEventsubStatusQuery,
  useEnableTestEventsubMutation,
  useDisableTestEventsubMutation,
  useRevokeTokenMutation,
  useSaveAuthToBroadcasterMutation,
  useSaveTwitchConfigMutation,
  useRefreshEventSubsMutation,
  useDeleteEventSubMutation,
  useInitEventSubMutation,
} = twitchApi;
