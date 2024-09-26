import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getConfig: builder.query({
      query: () => '/config/server_config',
    }),
    getUdpClients: builder.query({
      query: () => '/config/udp_clients',
    }),
    getOSCTunnels: builder.query({
      query: () => '/config/osc_tunnels',
    }),
    saveOSCTunnels: builder.mutation({
      query: (form) => ({
        url: '/config/save_osc_tunnels',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    saveConfig: builder.mutation({
      query: (form) => ({
        url: '/config/save_config',
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
  useGetConfigQuery,
  useGetUdpClientsQuery,
  useSaveConfigMutation,
  useGetOSCTunnelsQuery,
  useSaveOSCTunnelsMutation,
} = configApi;
