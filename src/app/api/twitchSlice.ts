import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const twitchApi = createApi({
  reducerPath: 'twitchApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/twitch' }),
  endpoints: (builder) => ({
    getEventSubs: builder.query({
      query: () => '/eventsubs',
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
    getConfig: builder.query({
      query: () => '/get_config',
    }),
    getChannelPointRewards: builder.query({
      query: () => '/get_channelpoint_rewards',
    }),
    getEventSubsByUser: builder.query({
      query: (twitchId: string) => `/get_channelpoint_rewards?twitchid=${twitchId}`,
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
  useConvertEventSubToSpooderMutation,
  useGetEventSubsQuery,
  useGetAvailableEventSubsQuery,
  useGetAvailableScopesQuery,
  useGetLinkedAccountsQuery,
  useGetConfigQuery,
  useGetChannelPointRewardsQuery,
  useGetEventSubsByUserQuery,
  useRevokeTokenMutation,
  useSaveAuthToBroadcasterMutation,
  useSaveTwitchConfigMutation,
  useRefreshEventSubsMutation,
  useDeleteEventSubMutation,
  useInitEventSubMutation,
} = twitchApi;
