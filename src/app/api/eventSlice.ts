import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const eventApi = createApi({
  reducerPath: 'eventApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/events' }),
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
  useVerifyResponseScriptMutation,
} = eventApi;
