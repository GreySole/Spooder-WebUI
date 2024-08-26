import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin+"/events" }),
  endpoints: (builder) => ({
    getEvents: builder.query({
      query: () => '/command_table',
    }),
    saveEvents: builder.mutation({
      query: (form) => ({
        url: '/saveCommandList',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const { useGetEventsQuery, useSaveEventsMutation } = eventApi;
