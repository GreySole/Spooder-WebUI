import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const shareApi = createApi({
  reducerPath: 'shareApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getShares: builder.query({
      query: () => '/shares/list',
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
  useVerifyShareTargetMutation,
  useSetShareMutation,
  useSaveSharesMutation,
} = shareApi;
