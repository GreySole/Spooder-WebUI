import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const obsApi = createApi({
  reducerPath: 'obsApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin }),
  endpoints: (builder) => ({
    getObsSettings: builder.query({
      query: () => '/obs/get_output_settings',
    }),
    getScenes: builder.query({
      query: () => '/obs/get_scenes',
    }),
    saveObsSettings: builder.mutation({
      query: (form) => ({
        url: '/obs/save_output_settings',
        method: 'post',
        body: form,
        headers: {
          'Content-type': 'application/json; charset=UTF-8',
        },
      }),
    }),
  }),
});

export const { useGetObsSettingsQuery, useGetScenesQuery, useSaveObsSettingsMutation } = obsApi;
