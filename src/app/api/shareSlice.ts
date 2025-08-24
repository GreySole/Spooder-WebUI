import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shareApi = createApi({
  reducerPath: 'shareApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/shares' }),
  endpoints: (builder) => ({
    getShares: builder.query({
      query: () => '/list',
    }),
    getActiveShares: builder.query({
      query: () => '/active_shares',
    }),
    verifyShareTarget: builder.mutation({
      query: (form) => ({
        url: `/verify_share_target?shareuser=${form.shareuser}&shareplatform=${form.shareplatform}`,
        method: 'get',
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    createShare: builder.mutation({
      query: (form) => ({
        url: '/create_share',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteShare: builder.mutation({
      query: (form) => ({
        url: '/delete_share',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveShare: builder.mutation({
      query: (form) => ({
        url: '/save_share',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setShare: builder.mutation({
      query: (form) => ({
        url: '/set_share',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    setAutoShare: builder.mutation({
      query: (form) => ({
        url: '/set_auto_share',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    createShareKey: builder.mutation({
      query: (form) => ({
        url: '/create_share_key',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    deleteShareKey: builder.mutation({
      query: (form) => ({
        url: '/delete_share_key',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveShares: builder.mutation({
      query: (form) => ({
        url: '/save_shares',
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
  useCreateShareMutation,
  useDeleteShareMutation,
  useSaveShareMutation,
  useCreateShareKeyMutation,
  useDeleteShareKeyMutation,
  useSetAutoShareMutation,
  useGetSharesQuery,
  useGetActiveSharesQuery,
  useVerifyShareTargetMutation,
  useSetShareMutation,
  useSaveSharesMutation,
} = shareApi;
