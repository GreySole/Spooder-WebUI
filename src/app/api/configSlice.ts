import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getConfig: builder.query({
      query: () => 'server_config',
    }),
    getUdpClients: builder.query({
      query: () => 'udp_hosts',
    }),
    saveConfig: builder.mutation({
      query: (form) => ({
        url: 'saveConfig',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const { useGetConfigQuery, useGetUdpClientsQuery, useSaveConfigMutation } = configApi;
