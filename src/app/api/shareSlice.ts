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
      query: (shareUser) => ({
        url: '/verify_share_target?shareuser=' + shareUser,
        method: 'get',
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
  useGetSharesQuery,
  useGetActiveSharesQuery,
  useVerifyShareTargetMutation,
  useSetShareMutation,
  useSaveSharesMutation,
} = shareApi;
