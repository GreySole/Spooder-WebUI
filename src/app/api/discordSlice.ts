import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const discordApi = createApi({
  reducerPath: 'discordApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getChannels: builder.query({
      query: () => '/discord/get_channels',
    }),
    getConfig: builder.query({
      query: () => '/discord/config',
    }),
    getUser: builder.query({
      query: () => '/discord/user',
    }),
    saveDiscordConfig: builder.mutation({
      query: (form) => ({
        url: '/discord/saveDiscordConfig',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const {
  useGetChannelsQuery,
  useGetConfigQuery,
  useGetUserQuery,
  useSaveDiscordConfigMutation,
} = discordApi;
