import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const themeApi = createApi({
  reducerPath: 'themeApi',
  baseQuery: fetchBaseQuery({ baseUrl: window.location.origin + '/theme' }),
  endpoints: (builder) => ({
    getMainTheme: builder.query({
      query: () => '/main_theme',
    }),
    saveTheme: builder.mutation({
      query: (form) => ({
        url: '/save_main_theme',
        method: 'post',
        body: form,
        contentType: 'application/json',
      }),
    }),
    getCustomSpooder: builder.query({
      query: () => '/custom_spooder',
    }),
    saveCustomSpooder: builder.mutation({
      query: (form) => ({
        url: '/save_custom_spooder',
        method: 'post',
        body: form,
        contentType: 'application/json',
      }),
    }),
  }),
});

export const {
  useGetMainThemeQuery,
  useSaveThemeMutation,
  useGetCustomSpooderQuery,
  useSaveCustomSpooderMutation,
} = themeApi;
