import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const discordApi = createApi({
  reducerPath: 'discordApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/discord' }),
  endpoints: (builder) => ({
    getGuilds: builder.query({
      query: () => '/get_guilds',
    }),
    getConfig: builder.query({
      query: () => '/config',
    }),
    getUser: builder.query({
      query: () => '/user',
    }),
    verifyDiscordTarget: builder.mutation({
      query: (discordId) => ({
        url: '/user?userid=' + discordId,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveDiscordConfig: builder.mutation({
      query: (form) => ({
        url: '/save_discord_config',
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
  useGetGuildsQuery,
  useGetConfigQuery,
  useGetUserQuery,
  useSaveDiscordConfigMutation,
} = discordApi;
