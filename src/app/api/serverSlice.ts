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
  }),
});

export const { useGetServerStateQuery, useGetMonitorLogsQuery, useGetSystemStatusQuery } =
  serverApi;
