import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const serverApi = createApi({
  reducerPath: 'serverApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getServerState: builder.query({
      query: () => 'server_state',
    }),
  }),
});

export const { useGetServerStateQuery } = serverApi;
