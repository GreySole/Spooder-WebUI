import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const configApi = createApi({
  reducerPath: 'configApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  // The UDP destination list is edited from two places now - the config tab's form and the
  // OSC Send node's inspector panel - so it is tagged rather than left to cache forever:
  // whichever one saves, every dropdown reading the list refetches.
  tagTypes: ['Config', 'UdpServers'],
  endpoints: (builder) => ({
    getConfig: builder.query({
      query: () => '/config/server_config',
      providesTags: ['Config'],
    }),
    getUdpServers: builder.query({
      query: () => '/config/udp_clients',
      providesTags: ['UdpServers'],
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
      // The config form owns the UDP list too, so saving it moves both.
      invalidatesTags: ['Config', 'UdpServers'],
    }),
    saveUdpServers: builder.mutation({
      query: (udpServers) => ({
        url: '/config/save_udp_servers',
        method: 'post',
        body: udpServers,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      // 'Config' as well: the server writes the map into config.json, so a config form
      // loaded from the old snapshot would save the new destination straight back out.
      invalidatesTags: ['UdpServers', 'Config'],
    }),
  }),
});

export const {
  useGetConfigQuery,
  useGetUdpServersQuery,
  useSaveConfigMutation,
  useGetOSCTunnelsQuery,
  useSaveOSCTunnelsMutation,
  useSaveUdpServersMutation,
} = configApi;
