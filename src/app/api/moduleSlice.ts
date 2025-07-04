import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const moduleApi = createApi({
  reducerPath: 'moduleApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getResponseHandlers: builder.query({
      query: () => '/module/get_response_handlers',
    }),
  }),
});

export const { useGetResponseHandlersQuery } = moduleApi;
