import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const discordApi = createApi({
  reducerPath: 'discordApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getGuilds: builder.query({
      query: () => '/discord/get_guilds',
    }),
    getConfig: builder.query({
      query: () => '/discord/config',
    }),
    getUser: builder.query({
      query: () => '/discord/user',
    }),
    saveDiscordConfig: builder.mutation({
      query: (form) => ({
        url: '/discord/save_discord_config',
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
