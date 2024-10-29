import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const obsApi = createApi({
  reducerPath: 'obsApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/obs' }),
  endpoints: (builder) => ({
    connectObs: builder.mutation({
      query: (form) => ({
        url: '/connect',
        method: 'POST',
        body: JSON.stringify(form),
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
    getObsStatus: builder.query({
      query: () => '/get_connection_status',
    }),
    getObsSettings: builder.query({
      query: () => '/get_output_settings',
    }),
    getScenes: builder.query({
      query: () => '/get_scenes',
    }),
    saveObsSettings: builder.mutation({
      query: (form) => ({
        url: '/save_output_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json;',
        },
      }),
    }),
  }),
});

export const {
  useConnectObsMutation,
  useGetObsStatusQuery,
  useGetObsSettingsQuery,
  useGetScenesQuery,
  useSaveObsSettingsMutation,
} = obsApi;
