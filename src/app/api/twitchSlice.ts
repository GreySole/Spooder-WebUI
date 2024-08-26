import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const twitchApi = createApi({
  reducerPath: 'twitchApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getEventsubs: builder.query({
      query: () => '/twitch/eventsubs',
    }),
    getEventsubsList: builder.query({
      query: () => '/twitch/eventsubs/list',
    }),
    getEventsubTypes: builder.query({
      query: () => '/twitch/eventsubs/types',
    }),
    getConfig: builder.query({
      query: () => '/twitch/config',
    }),
    getChannelPointRewards: builder.query({
      query: () => '/twitch/get_channelpoint_rewards',
    }),
    getEventsubsByUser: builder.query({
      query: (twitchId: string) => `/twitch/get_channelpoint_rewards?twitchid=${twitchId}`,
    }),
    revokeToken: builder.mutation({
      query: () => ({
        url: `/twitch/revoke`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveAuthToBroadcaster: builder.mutation({
      query: () => ({
        url: `/twitch/save_auth_to_broadcaster`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    convertEventsubToSpooder: builder.mutation({
      query: () => ({
        url: `/convertEventsubToSpooder`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveTwitchConfig: builder.mutation({
      query: (form) => ({
        url: '/twitch/saveConfig',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    refreshEventsubs: builder.mutation({
      query: () => ({
        url: `/twitch/refresh_eventsubs`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    initEventsub: builder.mutation({
      query: ({ type, user_id }) => ({
        url: `/twitch/init_eventsub?type=${type}&user_id=${user_id}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteEventsub: builder.mutation({
      query: (subId: string) => ({
        url: `/twitch/delete_eventsub?id=${subId}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const {
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
} = twitchApi;
