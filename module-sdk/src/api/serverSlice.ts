import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/server' }),
  endpoints: (builder) => ({
    getServerState: builder.query({
      query: () => '/server_state',
    }),
    getMonitorLogs: builder.query({
      query: () => '/log',
    }),
    getSystemStatus: builder.query({
      query: () => '/status',
    }),
    getPublicUrl: builder.query({
      query: () => '/public_url',
    }),
    // Subscribes (or renews) this instance's interest in the live OSC log feed - see
    // MonitorService.subscribeLiveLogging. Called on mount and on a heartbeat interval.
    subscribeLiveLogging: builder.mutation({
      query: (clientId: string) => ({
        url: `/monitor/live_logging/${clientId}`,
        method: 'post',
      }),
    }),
    // `keepalive` lets this survive a tab close, which fires it mid-unload: the browser sends
    // the request even after the page that queued it is gone. Without it the request would
    // race the unload and often lose, leaving the server to fall back on the TTL sweep.
    unsubscribeLiveLogging: builder.mutation({
      query: (clientId: string) => ({
        url: `/monitor/live_logging/${clientId}`,
        method: 'delete',
        keepalive: true,
      }),
    }),
  }),
});

export const {
  useGetServerStateQuery,
  useGetMonitorLogsQuery,
  useGetSystemStatusQuery,
  useGetPublicUrlQuery,
  useSubscribeLiveLoggingMutation,
  useUnsubscribeLiveLoggingMutation,
} = serverApi;
