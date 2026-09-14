import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/events' }),
  // Scoped per event name so editing one event's storage doesn't invalidate another's cache.
  tagTypes: ['EventStorage'],
  endpoints: (builder) => ({
    getEventGraphs: builder.query({
      query: () => '/event_graphs',
    }),
    getChatCommands: builder.query({
      query: () => '/chat_commands',
    }),
    saveEventGraphs: builder.mutation({
      query: (form) => ({
        url: '/save_event_graphs',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    getNodeManifest: builder.query({
      query: () => '/node_manifest',
    }),
    getOperationNodes: builder.query({
      query: () => '/operation_nodes',
    }),
    getEventStorage: builder.query({
      query: (eventName: string) => `/event_storage/${encodeURIComponent(eventName)}`,
      providesTags: (result, error, eventName) => [{ type: 'EventStorage', id: eventName }],
    }),
    setEventStorageValue: builder.mutation({
      query: ({ eventName, key, value }: { eventName: string; key: string; value: unknown }) => ({
        url: `/event_storage/${encodeURIComponent(eventName)}`,
        method: 'post',
        body: { key, value },
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
      invalidatesTags: (result, error, { eventName }) => [{ type: 'EventStorage', id: eventName }],
    }),
    deleteEventStorageValue: builder.mutation({
      query: ({ eventName, key }: { eventName: string; key: string }) => ({
        url: `/event_storage/${encodeURIComponent(eventName)}/${encodeURIComponent(key)}`,
        method: 'delete',
      }),
      invalidatesTags: (result, error, { eventName }) => [{ type: 'EventStorage', id: eventName }],
    }),
    verifyResponseScript: builder.mutation({
      query: (body) => ({
        url: '/verify_response_script',
        method: 'post',
        body: body,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const {
  useGetEventGraphsQuery,
  useGetChatCommandsQuery,
  useSaveEventGraphsMutation,
  useGetNodeManifestQuery,
  useGetOperationNodesQuery,
  useGetEventStorageQuery,
  useSetEventStorageValueMutation,
  useDeleteEventStorageValueMutation,
  useVerifyResponseScriptMutation,
} = eventApi;
