import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shareApi = createApi({
  reducerPath: 'shareApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getShares: builder.query({
      query: () => '/shares/list',
    }),
    getActiveShares: builder.query({
      query: () => '/shares/active_shares',
    }),
    verifyShareTarget: builder.mutation({
      query: (shareUser) => ({
        url: '/shares/verify_share_target?shareuser=' + shareUser,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    verifyDiscordTarget: builder.mutation({
      query: (discordId) => ({
        url: '/discord/user?userid=' + discordId,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setShare: builder.mutation({
      query: (form) => ({
        url: '/shares/set_share',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveShares: builder.mutation({
      query: (form) => ({
        url: '/shares/save_shares',
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
  useGetSharesQuery,
  useGetActiveSharesQuery,
  useVerifyShareTargetMutation,
  useSetShareMutation,
  useSaveSharesMutation,
} = shareApi;
